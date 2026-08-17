"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import TaskHeader from "@/components/taskHeader";
import ActiveFilterChips from "@/components/projects/ActiveFilterChips";
import ProjectListView from "@/components/projects/ProjectListView";
import ProjectBoardView from "@/components/projects/ProjectBoardView";
import AddProjectModal from "@/components/projects/AddProjectModal";
import { INITIAL_PROJECTS, FILTER_CONFIGS } from "@/components/projects/data";
import {
  Project,
  ActiveFilters,
  VisibleFields,
  StatusType,
} from "@/components/projects/types";

export default function ProjectsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // View Mode: 'list' or 'board', persisted in localStorage
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  // Load view mode preference from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("projects_view_mode");
    if (savedMode === "list" || savedMode === "board") {
      setViewMode(savedMode);
    }
  }, []);

  const handleViewModeChange = (mode: "list" | "board") => {
    setViewMode(mode);
    localStorage.setItem("projects_view_mode", mode);
  };

  // Projects state
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  // Search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Active filters state
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  // Visible fields state
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

  // Add Project modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialStatus, setAddModalInitialStatus] = useState<StatusType>("Planned");

  // Handle responsive sidebar on window resize
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
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
    setAddModalInitialStatus(defaultStatus);
    setIsAddModalOpen(true);
  };

  const handleSaveProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Dynamic project filtering logic matching search and active filters
  const filteredProjects = projects.filter((project) => {
    // 1. Match Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = project.name.toLowerCase().includes(q);
      const matchPriority = project.priority.toLowerCase().includes(q);
      const matchStatus = project.status.toLowerCase().includes(q);
      const matchDueDate = project.dueDate.toLowerCase().includes(q);
      const matchReporter = project.reporter.toLowerCase().includes(q);
      const matchTeams = project.teams.some((t) => t.toLowerCase().includes(q));
      const matchLabels = project.labels.some((l) => l.toLowerCase().includes(q));
      const matchMembers = project.members.some((m) =>
        m.name.toLowerCase().includes(q)
      );

      if (
        !matchName &&
        !matchPriority &&
        !matchStatus &&
        !matchDueDate &&
        !matchReporter &&
        !matchTeams &&
        !matchLabels &&
        !matchMembers
      ) {
        return false;
      }
    }

    // 2. Match Active Filters
    for (const [key, value] of Object.entries(activeFilters)) {
      if (!value || value.startsWith("All ")) continue;

      if (key === "status" && project.status !== value) return false;
      if (key === "priority" && project.priority !== value) return false;
      if (key === "reporter" && project.reporter !== value) return false;
      if (key === "teams" && !project.teams.includes(value)) return false;
      if (key === "labels" && !project.labels.includes(value)) return false;
      if (key === "members" && !project.members.some((m) => m.name === value))
        return false;
      if (key === "dueDate") {
        if (value === "No Due Date" && project.dueDate) return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0A0A0A] transition-colors duration-200">
      {/* Sidebar Container */}
      <div
        className={`transition-all duration-300 ease-in-out relative z-40 ${
          isSidebarOpen ? "w-[13.5rem] overflow-visible" : "w-0 overflow-hidden"
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
            {/* Header section with Search, Fields, Filter, View Switcher & Add Project */}
            <TaskHeader
              title="Projects"
              addLabel="Add Project"
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              visibleFields={visibleFields}
              onToggleField={handleToggleField}
              filterConfigs={FILTER_CONFIGS}
              activeFilters={activeFilters}
              onSelectFilter={handleSelectFilter}
              onAddTask={() => handleOpenAddModal("Planned")}
            />

            {/* Active Filter Chips Bar */}
            <ActiveFilterChips
              activeFilters={activeFilters}
              filterConfigs={FILTER_CONFIGS}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* View Content: List View or Board View */}
            {viewMode === "list" ? (
              <ProjectListView
                projects={filteredProjects}
                visibleFields={visibleFields}
                onAddProject={() => handleOpenAddModal("Planned")}
                onDeleteProject={handleDeleteProject}
              />
            ) : (
              <ProjectBoardView
                projects={filteredProjects}
                visibleFields={visibleFields}
                onAddProject={handleOpenAddModal}
                onDeleteProject={handleDeleteProject}
              />
            )}
          </div>
        </div>
      </main>

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveProject}
        initialStatus={addModalInitialStatus}
      />
    </div>
  );
}
