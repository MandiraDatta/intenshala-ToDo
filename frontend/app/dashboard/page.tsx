"use client";

import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import TaskHeader, { VisibleFields } from "@/components/taskHeader";
import KanbanColumn, { Task } from "@/components/kanbanColumn";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { taskService } from "@/services/task.service";
import { projectService } from "@/services/project.service";
import { preferenceService } from "@/services/preference.service";

function DashboardContent() {
  const { activeWorkspace } = useWorkspace();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectIdParam = searchParams.get("projectId");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [pageTitle, setPageTitle] = useState("Tasks");

  // View mode state: 'board' vs 'list'
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  // Search query state for live task filtering
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamic state for visible fields
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    priority: false,
    members: true,
    dueDate: true,
    labels: true,
    status: false,
    reporter: false,
  });

  // State to manage Add Task modal visibility and targeted column ID
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>("todo");

  // Form input states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskTag, setNewTaskTag] = useState("");
  const [loading, setLoading] = useState(true);

  // Dynamic column state initialized to empty tasks (0 mock data)
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do", tasks: [] as Task[] },
    { id: "doing", title: "Doing", tasks: [] as Task[] },
    { id: "completed", title: "Completed", tasks: [] as Task[] },
    { id: "on-hold", title: "On Hold", tasks: [] as Task[] },
  ]);

  // Restore stored view preferences
  useEffect(() => {
    if (!activeWorkspace?.id) return;
    preferenceService.getViewPreference(activeWorkspace.id, 'TASK')
      .then((pref) => {
        if (pref) {
          if (pref.viewType === 'LIST' || pref.viewType === 'BOARD') {
            setViewMode(pref.viewType.toLowerCase() as "board" | "list");
          }
        }
      })
      .catch(() => { });
  }, [activeWorkspace?.id]);

  // Auto-redirect to first project if no projectIdParam is present (ensuring tasks always belong to a project)
  useEffect(() => {
    if (!activeWorkspace?.id) return;
    if (!projectIdParam) {
      projectService
        .getProjects(activeWorkspace.id)
        .then((res) => {
          const projectsList = res.data || res || [];
          if (Array.isArray(projectsList) && projectsList.length > 0) {
            router.replace(`/dashboard?projectId=${projectsList[0].id}`);
          } else {
            router.replace("/projects");
          }
        })
        .catch(() => {
          router.replace("/projects");
        });
    }
  }, [activeWorkspace?.id, projectIdParam, router]);

  // Fetch project details to show project name in header title if projectIdParam is set
  useEffect(() => {
    if (activeWorkspace?.id && projectIdParam) {
      projectService
        .getProjectById(activeWorkspace.id, projectIdParam)
        .then((proj) => {
          if (proj?.name) {
            setPageTitle(proj.name);
          } else {
            setPageTitle("Project Tasks");
          }
        })
        .catch(() => {
          setPageTitle("Project Tasks");
        });
    } else {
      setPageTitle("Tasks");
    }
  }, [activeWorkspace?.id, projectIdParam]);

  const handleViewModeChange = (mode: "board" | "list") => {
    setViewMode(mode);
    if (activeWorkspace?.id) {
      preferenceService.updateViewPreference(activeWorkspace.id, {
        entityType: 'TASK',
        viewType: mode.toUpperCase() as 'LIST' | 'BOARD',
      }).catch(() => { });
    }
  };

  // Fetch dynamic tasks strictly from NestJS API
  const fetchTasks = useCallback(async () => {
    if (!activeWorkspace?.id) {
      setColumns([
        { id: "todo", title: "To Do", tasks: [] },
        { id: "doing", title: "Doing", tasks: [] },
        { id: "completed", title: "Completed", tasks: [] },
        { id: "on-hold", title: "On Hold", tasks: [] },
      ]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await taskService.getTasks(activeWorkspace.id, {
        search: searchQuery.trim() || undefined,
        projectId: projectIdParam || undefined,
      });
      const items = res.data || res || [];

      const todoTasks: Task[] = [];
      const doingTasks: Task[] = [];
      const completedTasks: Task[] = [];
      const onHoldTasks: Task[] = [];

      (Array.isArray(items) ? items : []).forEach((item: any) => {
        if (projectIdParam && item.projectId && item.projectId !== projectIdParam) {
          return;
        }

        const formattedTask: Task = {
          id: item.id,
          title: item.title,
          status: item.status || "TODO",
          priority: item.priority || "MEDIUM",
          dueDate: item.dueDate ? new Date(item.dueDate).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : undefined,
          members: Array.isArray(item.members) ? item.members.map((m: any) => ({
            id: m.id || m.userId,
            name: m.fullName || m.username || "Member",
            avatar: m.avatarUrl || m.avatar,
            initials: (m.fullName || m.username || "M")[0].toUpperCase(),
          })) : [],
          assignee: item.members?.[0]?.fullName || item.createdBy?.fullName,
          tags: item.labels?.map((l: any) => l.label?.name || l.name) || [],
        };

        const st = (item.status || "TODO").toUpperCase();
        if (st === "TODO") todoTasks.push(formattedTask);
        else if (st === "DOING" || st === "IN_PROGRESS") doingTasks.push(formattedTask);
        else if (st === "COMPLETED" || st === "DONE") completedTasks.push(formattedTask);
        else if (st === "ON_HOLD") onHoldTasks.push(formattedTask);
        else todoTasks.push(formattedTask);
      });

      setColumns([
        { id: "todo", title: "To Do", tasks: todoTasks },
        { id: "doing", title: "Doing", tasks: doingTasks },
        { id: "completed", title: "Completed", tasks: completedTasks },
        { id: "on-hold", title: "On Hold", tasks: onHoldTasks },
      ]);
    } catch (err) {
      console.error("Failed to fetch tasks from backend:", err);
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id, searchQuery, projectIdParam]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:767px)");
    const handleResize = () => setSidebarOpen(!mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleToggleField = (field: keyof VisibleFields) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAddTask = (columnId?: string) => {
    const targetId = columnId || "todo";
    setActiveColumnId(targetId);
    setIsAddTaskOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddTaskOpen(false);
    setNewTaskTitle("");
    setNewTaskAssignee("");
    setNewTaskDueDate("");
    setNewTaskTag("");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const targetColId = activeColumnId || "todo";
    const statusMap: Record<string, string> = {
      "todo": "TODO",
      "doing": "DOING",
      "completed": "COMPLETED",
      "on-hold": "ON_HOLD",
    };

    const formattedDueDateStr = newTaskDueDate
      ? new Date(newTaskDueDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })
      : undefined;

    // Optimistically create task locally so user gets instant visual feedback
    const tempId = `temp-${Date.now()}`;
    const newTaskObj: Task = {
      id: tempId,
      title: newTaskTitle.trim(),
      status: statusMap[targetColId] || "TODO",
      priority: "MEDIUM",
      dueDate: formattedDueDateStr,
      assignee: newTaskAssignee.trim() || undefined,
      tags: newTaskTag.trim() ? [newTaskTag.trim()] : [],
    };

    setColumns((prevCols) =>
      prevCols.map((col) =>
        col.id === targetColId ? { ...col, tasks: [...col.tasks, newTaskObj] } : col
      )
    );

    handleCloseModal();

    if (activeWorkspace?.id) {
      try {
        await taskService.createTask(activeWorkspace.id, {
          title: newTaskTitle.trim(),
          status: statusMap[targetColId] || "TODO",
          priority: "MEDIUM",
          dueDate: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : undefined,
          projectId: projectIdParam || undefined,
        });
        await fetchTasks();
      } catch (err) {
        console.error("Failed to create task on backend:", err);
      }
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, targetColId: string) => {
    const statusMap: Record<string, string> = {
      "todo": "TODO",
      "doing": "DOING",
      "completed": "COMPLETED",
      "on-hold": "ON_HOLD",
    };
    const targetStatus = statusMap[targetColId] || "TODO";

    // Optimistically update local columns state
    setColumns((prevCols) => {
      let movedTask: Task | null = null;
      const updatedCols = prevCols.map((col) => {
        const found = col.tasks.find((t) => t.id === taskId);
        if (found) {
          movedTask = found;
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        return col;
      });

      if (!movedTask) return prevCols;

      return updatedCols.map((col) => {
        if (col.id === targetColId) {
          return { ...col, tasks: [...col.tasks, movedTask!] };
        }
        return col;
      });
    });

    if (activeWorkspace?.id) {
      try {
        await taskService.updateTaskStatus(activeWorkspace.id, taskId, targetStatus);
      } catch (err) {
        console.error("Failed to update task status on backend", err);
        fetchTasks();
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
        {/* Top Navbar Component */}
        <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Page Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="h-full w-full gap-5 flex flex-col">
            {/* Tasks Header Component */}
            <TaskHeader
              title={pageTitle}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              visibleFields={visibleFields}
              onToggleField={handleToggleField}
              onAddTask={() => handleAddTask("todo")}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {loading ? (
              <div className="w-full h-64 flex items-center justify-center text-xs text-neutral-400 font-medium">
                Loading tasks...
              </div>
            ) : viewMode === "board" ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
                {columns.map((col) => (
                  <KanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    tasks={col.tasks}
                    visibleFields={visibleFields}
                    isListMode={false}
                    onAddTask={() => handleAddTask(col.id)}
                    onUpdateTaskStatus={handleUpdateTaskStatus}
                    onMoreOptions={() => { }}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full flex flex-col gap-3">
                {columns.map((col) => (
                  <KanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    tasks={col.tasks}
                    visibleFields={visibleFields}
                    isListMode={true}
                    onAddTask={() => handleAddTask(col.id)}
                    onUpdateTaskStatus={handleUpdateTaskStatus}
                    onMoreOptions={() => { }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Task Modal / Form */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTask}
            className="bg-white dark:bg-[#171717] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xl w-full max-w-md p-5 flex flex-col gap-4 transition-colors duration-200"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
              <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F5F5F5]">
                Add Task to "{columns.find((c) => c.id === (activeColumnId || "todo"))?.title || "To Do"}"
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors p-1 cursor-pointer"
                type="button"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Write API Documentation"
                  className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] dark:placeholder:text-[#737373] rounded focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">Assignee</label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    placeholder="Enter assignee name..."
                    className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] dark:placeholder:text-[#737373] rounded focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] dark:placeholder:text-[#737373] rounded focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">Tag</label>
                <input
                  type="text"
                  value={newTaskTag}
                  onChange={(e) => setNewTaskTag(e.target.value)}
                  placeholder="Enter tag (e.g. Deployment)..."
                  className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] dark:placeholder:text-[#737373] rounded focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
              <button
                onClick={handleCloseModal}
                type="button"
                className="px-3 py-1.5 text-xs font-medium text-[#171717] dark:text-[#F5F5F5] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-white dark:text-black bg-[#171717] dark:bg-[#F5F5F5] rounded hover:bg-[#262626] dark:hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center text-xs text-neutral-400 font-medium">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}