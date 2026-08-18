"use client";

import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import TaskHeader, { VisibleFields } from "@/components/taskHeader";
import KanbanColumn, { Task } from "@/components/kanbanColumn";
import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { taskService } from "@/services/task.service";
import { preferenceService } from "@/services/preference.service";

export default function Dashboard() {
  const { activeWorkspace } = useWorkspace();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
  const [newTaskAssignee, setNewTaskAssignee] = useState("Admin");
  const [newTaskDueDate, setNewTaskDueDate] = useState("29 Jul");
  const [newTaskTag, setNewTaskTag] = useState("Deployment");
  const [loading, setLoading] = useState(false);

  // Dynamic column state
  const [columns, setColumns] = useState([
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "t1",
          title: "Design Homepage",
          assignee: { name: "Admin" },
          dueDate: "12 Sep 2026",
          priority: "High",
          tags: ["Design", "UI"],
        },
        {
          id: "t2",
          title: "Implement Search Function",
          assignee: { name: "Admin" },
          dueDate: "29 Jul",
          priority: "Medium",
          tags: ["Deployment"],
        },
      ] as Task[],
    },
    {
      id: "doing",
      title: "Doing",
      tasks: [
        {
          id: "d1",
          title: "Code Review Completed",
          assignee: { name: "Admin" },
          dueDate: "29 Jul",
          priority: "Medium",
          tags: ["Deployment"],
        },
      ] as Task[],
    },
    {
      id: "completed",
      title: "Completed",
      tasks: [
        {
          id: "c1",
          title: "Feature Testing Passed",
          assignee: { name: "QA Team" },
          dueDate: "30 Jul",
          priority: "Low",
          tags: ["Testing"],
        },
      ] as Task[],
    },
    {
      id: "on-hold",
      title: "On Hold",
      tasks: [
        {
          id: "oh1",
          title: "UI Review Pending",
          assignee: { name: "Design" },
          dueDate: "29 Jul",
          priority: "Low",
          tags: ["Review"],
        },
      ] as Task[],
    },
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
      .catch(() => {});
  }, [activeWorkspace?.id]);

  const handleViewModeChange = (mode: "board" | "list") => {
    setViewMode(mode);
    if (activeWorkspace?.id) {
      preferenceService.updateViewPreference(activeWorkspace.id, {
        entityType: 'TASK',
        viewType: mode.toUpperCase() as 'LIST' | 'BOARD',
      }).catch(() => {});
    }
  };

  // Fetch dynamic tasks from NestJS
  const fetchTasks = useCallback(async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    try {
      const res = await taskService.getTasks(activeWorkspace.id, {
        search: searchQuery.trim() || undefined,
      });
      const items = res.data || res || [];

      if (Array.isArray(items) && items.length > 0) {
        const todoTasks: Task[] = [];
        const doingTasks: Task[] = [];
        const completedTasks: Task[] = [];
        const onHoldTasks: Task[] = [];

        items.forEach((item: any) => {
          const formatted: Task = {
            id: item.id,
            title: item.title,
            assignee: { name: item.assignee?.user?.fullName || item.assignee?.fullName || "Admin" },
            dueDate: item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "29 Jul",
            priority: item.priority ? item.priority.charAt(0) + item.priority.slice(1).toLowerCase() : "Medium",
            tags: item.labels?.map((l: any) => l.name) || [item.type || "Deployment"],
          };

          const st = (item.status || "TODO").toUpperCase();
          if (st === "DOING" || st === "IN_PROGRESS") {
            doingTasks.push(formatted);
          } else if (st === "COMPLETED" || st === "DONE") {
            completedTasks.push(formatted);
          } else if (st === "ON_HOLD") {
            onHoldTasks.push(formatted);
          } else {
            todoTasks.push(formatted);
          }
        });

        setColumns([
          { id: "todo", title: "To Do", tasks: todoTasks },
          { id: "doing", title: "Doing", tasks: doingTasks },
          { id: "completed", title: "Completed", tasks: completedTasks },
          { id: "on-hold", title: "On Hold", tasks: onHoldTasks },
        ]);
      }
    } catch (e) {
      console.error("Failed to fetch tasks from server", e);
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id, searchQuery]);

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

    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignee: { name: newTaskAssignee || "Admin" },
      dueDate: newTaskDueDate || "29 Jul",
      priority: "Medium",
      tags: newTaskTag ? [newTaskTag] : ["Deployment"],
    };

    // Optimistically update local UI immediately
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === targetColId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    );

    // Save to NestJS backend if activeWorkspace exists
    if (activeWorkspace?.id) {
      try {
        await taskService.createTask(activeWorkspace.id, {
          title: newTaskTitle.trim(),
          status: statusMap[targetColId] || "TODO",
          priority: "MEDIUM",
        });
        fetchTasks();
      } catch (err) {
        console.error("Task saved locally, server sync error:", err);
      }
    }

    handleCloseModal();
  };

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
        {/* Top Navbar Component */}
        <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Page Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="h-full w-full gap-5 flex flex-col">
            {/* Tasks Header Component */}
            <TaskHeader
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              visibleFields={visibleFields}
              onToggleField={handleToggleField}
              onAddTask={() => handleAddTask("todo")}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {loading ? (
              <div className="w-full h-64 flex items-center justify-center text-xs text-neutral-400">
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
                    onMoreOptions={() => {}}
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
                    onMoreOptions={() => {}}
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
                    placeholder="Admin"
                    className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] dark:placeholder:text-[#737373] rounded focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">Due Date</label>
                  <input
                    type="text"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    placeholder="29 Jul"
                    className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] dark:placeholder:text-[#737373] rounded focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">Tag</label>
                <input
                  type="text"
                  value={newTaskTag}
                  onChange={(e) => setNewTaskTag(e.target.value)}
                  placeholder="Deployment"
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