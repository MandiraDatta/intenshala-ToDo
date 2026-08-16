"use client";

import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import TaskHeader, { VisibleFields } from "@/components/taskHeader";
import KanbanColumn, { Task } from "@/components/kanbanColumn";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // View mode state: 'board' vs 'list'
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  // Dynamic state for visible fields - members, dueDate, and labels enabled by default
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
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  // Form input states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("Admin");
  const [newTaskDueDate, setNewTaskDueDate] = useState("29 Jul");
  const [newTaskTag, setNewTaskTag] = useState("Deployment");

  // Initial column data matching reference design
  const [columns, setColumns] = useState([
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "t1",
          title: "Write API Documentation",
          assignee: { name: "Admin" },
          dueDate: "29 Jul",
          tags: ["Deployment", "Deployment"],
        },
        {
          id: "t2",
          title: "Implement Search Function",
          assignee: { name: "Admin" },
          dueDate: "29 Jul",
          tags: ["Deployment", "Deployment"],
        },
        {
          id: "t3",
          title: "Deploy to Production",
          assignee: { name: "Admin" },
          dueDate: "29 Jul",
          tags: ["Deployment", "Deployment"],
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
          tags: ["Deployment", "Deployment"],
        },
        {
          id: "d2",
          title: "Design Mockups Finalized",
          assignee: { name: "Admin" },
          dueDate: "29 Jul",
          tags: ["Deployment", "Deployment"],
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
          tags: ["Testing", "Passed"],
        },
        {
          id: "c2",
          title: "UI Design Updated",
          assignee: { name: "Designer" },
          dueDate: "31 Jul",
          tags: ["Design", "Updated"],
        },
        {
          id: "c3",
          title: "Security Audit Scheduled",
          assignee: { name: "Security" },
          dueDate: "01 Aug",
          tags: ["Audit", "Scheduled"],
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
          tags: ["Review", "Pending"],
        },
        {
          id: "oh2",
          title: "Backend API Optimization",
          assignee: { name: "Dev Team" },
          dueDate: "30 Jul",
          tags: ["Backend", "Performance"],
        },
      ] as Task[],
    },
  ]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:767px)");

    const handleResize = () => {
      setSidebarOpen(!mediaQuery.matches);
    };

    handleResize();

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const handleToggleField = (field: keyof VisibleFields) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Opens the Add Task form for the target column
  const handleAddTask = (columnId?: string) => {
    const targetId = columnId || "todo";
    setActiveColumnId(targetId);
    setIsAddTaskOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddTaskOpen(false);
    setActiveColumnId(null);
    setNewTaskTitle("");
  };

  // Submits the new task and appends it to the target column's tasks array
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeColumnId) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      assignee: { name: newTaskAssignee || "Admin" },
      dueDate: newTaskDueDate || "29 Jul",
      tags: newTaskTag ? [newTaskTag] : ["Deployment"],
    };

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === activeColumnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    );

    handleCloseModal();
  };

  const handleMoreOptions = (columnId?: string) => {
    console.log(`More options requested for column: ${columnId}`);
  };

  const activeColumn = columns.find((c) => c.id === activeColumnId);

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0A0A0A] transition-colors duration-200">
      {/* Sidebar Container */}
      <div
        className={`transition-all duration-300 ease-in-out relative z-40 ${isSidebarOpen
          ? "w-[10rem] sm:w-[12rem] md:w-[14rem] lg:w-[16rem] overflow-visible"
          : "w-0 overflow-hidden"
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
              onViewModeChange={setViewMode}
              visibleFields={visibleFields}
              onToggleField={handleToggleField}
              onAddTask={() => handleAddTask("todo")}
            />

            {/* Dynamic Layout: Grid for Board view Mode, Vertical Accordion Stack for List view Mode */}
            {viewMode === "board" ? (
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
                    onMoreOptions={() => handleMoreOptions(col.id)}
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
                    onMoreOptions={() => handleMoreOptions(col.id)}
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
                Add Task to "{activeColumn?.title}"
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors p-1"
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