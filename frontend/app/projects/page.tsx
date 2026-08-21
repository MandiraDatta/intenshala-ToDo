"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import TaskHeader from "@/components/taskHeader";
import ActiveFilterChips from "@/components/projects/ActiveFilterChips";
import ProjectListView from "@/components/projects/ProjectListView";
import ProjectBoardView from "@/components/projects/ProjectBoardView";
import AddProjectModal from "@/components/projects/AddProjectModal";
import { FILTER_CONFIGS } from "@/components/projects/data";
import {
  Project,
  ActiveFilters,
  VisibleFields,
  StatusType,
} from "@/components/projects/types";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useRole } from "@/hooks/useRole";
import { projectService } from "@/services/project.service";
import { preferenceService } from "@/services/preference.service";

export default function ProjectsPage() {
  const { activeWorkspace } = useWorkspace();
  const { canManageProjects } = useRole();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // View Mode: 'list' or 'board'
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  // Projects state initialized to empty array (0 mock data)
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Active filters state
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  // Visible fields state matching user design (Projects, Priority, Lead, Due Date, Actions)
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    project: true,
    priority: true,
    members: true,
    dueDate: true,
    status: false,
    teams: false,
    labels: false,
    reporter: false,
  });

  // Add / Edit Project modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [addModalInitialStatus, setAddModalInitialStatus] = useState<StatusType>("Planned");

  // Load view mode and column preferences
  useEffect(() => {
    if (!activeWorkspace?.id) return;
    preferenceService.getViewPreference(activeWorkspace.id, 'PROJECT')
      .then((pref) => {
        if (pref) {
          if (pref.viewType === 'LIST' || pref.viewType === 'BOARD') {
            setViewMode(pref.viewType.toLowerCase() as "list" | "board");
          }
        }
      })
      .catch(() => { });
  }, [activeWorkspace?.id]);

  const handleViewModeChange = (mode: "list" | "board") => {
    setViewMode(mode);
    if (activeWorkspace?.id) {
      preferenceService.updateViewPreference(activeWorkspace.id, {
        entityType: 'PROJECT',
        viewType: mode.toUpperCase() as 'LIST' | 'BOARD',
      }).catch(() => { });
    }
  };

  // Fetch dynamic projects strictly from NestJS API
  const fetchProjects = useCallback(async () => {
    if (!activeWorkspace?.id) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const queryParams: any = {
        search: searchQuery.trim() || undefined,
        status: activeFilters.status ? activeFilters.status.toUpperCase().replace(/\s+/g, '_') : undefined,
        priority: activeFilters.priority ? activeFilters.priority.toUpperCase().replace(/\s+/g, '_') : undefined,
      };

      const res = await projectService.getProjects(activeWorkspace.id, queryParams);
      const items = res.data || res || [];

      const formatted: Project[] = (Array.isArray(items) ? items : []).map((item: any) => {
        let savedMeta: Partial<Project> = {};
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem(`proj_meta_${item.id}`);
            if (raw) savedMeta = JSON.parse(raw);
          } catch (e) { }
        }

        const backendMembers = (item.members || []).map((m: any) => ({
          id: m.id || m.userId || `m-${Math.random()}`,
          name: m.fullName || m.username || m.user?.fullName || m.name || "Member",
          initials: (m.fullName || m.username || m.user?.fullName || m.name || "M")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
          avatar: m.avatarUrl || m.avatar || m.user?.avatarUrl,
          source: (m.source === 'task' ? 'task' : 'project') as 'project' | 'task',
          email: m.email || m.user?.email,
        }));

        const backendDueDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined;
        const backendTeams = item.team ? [item.team.name] : (item.teams?.map((t: any) => t.name) || undefined);
        const backendLabels = item.labels?.map((l: any) => l.name) || undefined;
        const backendReporter = item.reporter?.fullName || undefined;

        return {
          id: item.id,
          name: item.name || "Untitled Project",
          priority: item.priority ? (item.priority.charAt(0) + item.priority.slice(1).toLowerCase().replace('_', ' ')) as any : "Medium",
          status: item.status === "IN_PROGRESS" ? "In Progress" : (item.status === "COMPLETED" ? "Completed" : "Planned"),
          members: (savedMeta.members && savedMeta.members.length > 0) ? savedMeta.members : backendMembers,
          dueDate: (savedMeta.dueDate && savedMeta.dueDate !== "No Due Date") ? savedMeta.dueDate : (backendDueDate || "No Due Date"),
          teams: (savedMeta.teams && savedMeta.teams.length > 0) ? savedMeta.teams : (backendTeams || []),
          labels: (savedMeta.labels && savedMeta.labels.length > 0) ? savedMeta.labels : (backendLabels || []),
          reporter: savedMeta.reporter || backendReporter || "",
        };
      });

      setProjects(formatted);
    } catch (e) {
      console.error("Failed to fetch projects from backend", e);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id, searchQuery, activeFilters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handle responsive sidebar
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleResize = () => {
      setSidebarOpen(!mediaQuery.matches);
    };
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleToggleField = (field: keyof VisibleFields) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSelectFilter = (key: string, value: string | null) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value === null || value.startsWith("All ")) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const handleRemoveFilter = (key: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters({});
  };

  const handleOpenAddModal = (defaultStatus: StatusType = "Planned") => {
    setEditingProject(null);
    setAddModalInitialStatus(defaultStatus);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setAddModalInitialStatus(project.status);
    setIsAddModalOpen(true);
  };

  const handleSaveProject = async (newProjData: Project) => {
    if (!activeWorkspace?.id) return;

    const statusMap: Record<string, string> = {
      "Planned": "PLANNED",
      "In Progress": "IN_PROGRESS",
      "Completed": "COMPLETED",
    };
    const priorityMap: Record<string, string> = {
      "Urgent": "URGENT",
      "High": "HIGH",
      "Medium": "MEDIUM",
      "Low": "LOW",
      "No Priority": "NONE",
    };

    if (editingProject) {
      const updatedProject = { ...editingProject, ...newProjData };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`proj_meta_${editingProject.id}`, JSON.stringify(updatedProject));
        } catch (e) { }
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? updatedProject : p))
      );
      setIsAddModalOpen(false);

      try {
        await projectService.updateProject(activeWorkspace.id, editingProject.id, {
          name: newProjData.name,
          status: statusMap[newProjData.status] || "PLANNED",
          priority: priorityMap[newProjData.priority] || "MEDIUM",
        });
        await fetchProjects();
      } catch (e) {
        console.error("Failed to update project on backend", e);
        fetchProjects();
      } finally {
        setEditingProject(null);
      }
    } else {
      if (typeof window !== "undefined" && newProjData.id) {
        try {
          localStorage.setItem(`proj_meta_${newProjData.id}`, JSON.stringify(newProjData));
        } catch (e) { }
      }

      setProjects((prev) => [newProjData, ...prev]);
      setIsAddModalOpen(false);

      try {
        const created = await projectService.createProject(activeWorkspace.id, {
          name: newProjData.name,
          description: "",
          status: statusMap[newProjData.status] || "PLANNED",
          priority: priorityMap[newProjData.priority] || "MEDIUM",
        });

        if (created?.id && typeof window !== "undefined") {
          const finalProj = { ...newProjData, id: created.id };
          try {
            localStorage.setItem(`proj_meta_${created.id}`, JSON.stringify(finalProj));
          } catch (e) { }
        }
        await fetchProjects();
      } catch (e) {
        console.error("Failed to create project on backend", e);
        fetchProjects();
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!activeWorkspace?.id) return;
    try {
      await projectService.deleteProject(activeWorkspace.id, id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Failed to delete project on backend", e);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: StatusType) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    if (activeWorkspace?.id) {
      try {
        const statusMap: Record<string, string> = {
          "Planned": "PLANNED",
          "In Progress": "IN_PROGRESS",
          "Completed": "COMPLETED",
        };
        await projectService.updateProjectStatus(
          activeWorkspace.id,
          id,
          statusMap[newStatus] || "PLANNED"
        );
      } catch (e) {
        console.error("Failed to sync project status update to server", e);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0A0A0A] transition-colors duration-200">
      {/* Sidebar Container */}
      <div
        className={`transition-all duration-300 ease-in-out relative z-40 ${isSidebarOpen ? "w-[13.5rem] overflow-visible" : "w-0 overflow-hidden"
          }`}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex flex-col flex-1 min-w-0 bg-white dark:bg-[#0A0A0A] transition-colors duration-200 relative z-0">
        {/* Top Navbar */}
        <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Page Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="h-full w-full flex flex-col gap-4">
            {/* Header section with Search, Fields, Filter, View Switcher & Add Task */}
            <TaskHeader
              title="Projects"
              addLabel={canManageProjects ? "Add Project" : undefined}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              visibleFields={visibleFields}
              onToggleField={handleToggleField}
              filterConfigs={FILTER_CONFIGS}
              activeFilters={activeFilters}
              onSelectFilter={handleSelectFilter}
              onAddTask={canManageProjects ? () => handleOpenAddModal("Planned") : undefined}
            />

            {/* Active Filter Chips Bar */}
            <ActiveFilterChips
              activeFilters={activeFilters}
              filterConfigs={FILTER_CONFIGS}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* View Content: List View or Board View */}
            {loading ? (
              <div className="w-full h-64 flex items-center justify-center text-xs text-neutral-400 font-medium">
                Loading projects...
              </div>
            ) : viewMode === "list" ? (
              <ProjectListView
                projects={projects}
                visibleFields={visibleFields}
                onAddProject={canManageProjects ? () => handleOpenAddModal("Planned") : () => {}}
                onDeleteProject={handleDeleteProject}
                onEditProject={handleOpenEditModal}
                onUpdateProject={(updated) =>
                  setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
                }
              />
            ) : (
              <ProjectBoardView
                projects={projects}
                visibleFields={visibleFields}
                onAddProject={canManageProjects ? handleOpenAddModal : () => {}}
                onDeleteProject={handleDeleteProject}
                onEditProject={handleOpenEditModal}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        </div>
      </main>

      {/* Add / Edit Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        initialStatus={addModalInitialStatus}
        initialProject={editingProject}
      />
    </div>
  );
}
