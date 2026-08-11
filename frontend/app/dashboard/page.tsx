"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBrandPrisma } from "@tabler/icons-react";

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design login page responsive layout",
      category: "Design",
      completed: true,
      priority: "high",
    },
    {
      id: "2",
      title: "Implement split-screen desktop design with animations",
      category: "Frontend",
      completed: true,
      priority: "high",
    },
    {
      id: "3",
      title: "Add dynamic form state and validation micro-interactions",
      category: "Frontend",
      completed: true,
      priority: "medium",
    },
    {
      id: "4",
      title: "Connect frontend to NestJS backend API controllers",
      category: "Backend",
      completed: false,
      priority: "medium",
    },
    {
      id: "5",
      title: "Configure unified monorepo gitignore rules",
      category: "DevOps",
      completed: false,
      priority: "low",
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [newTaskCategory, setNewTaskCategory] = useState("General");
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      category: newTaskCategory || "General",
      completed: false,
      priority: newTaskPriority,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setShowAddForm(false);
  };

  const handleLogout = () => {
    router.push("/");
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1f2937] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)] select-none">
        <div className="flex items-center gap-[8px]">
          <div className="p-[10px] rounded-md bg-black text-white flex items-center justify-center shadow-sm">
            <IconBrandPrisma size={24} className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            Pyramid
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold px-3 py-1.5 bg-[#f3f4f6] text-[#4b5563] rounded-full">
            Workspace: guest-user
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-1.5 hover:bg-neutral-100 rounded-lg cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Task Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back! Keep track of your tasks and projects.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="self-start sm:self-center px-4 py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-full transition-all duration-150 shadow-xs hover:shadow active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Task
          </button>
        </div>

        {/* Form to Create New Task */}
        {showAddForm && (
          <div className="mb-8 p-6 bg-white border border-gray-200/80 rounded-2xl shadow-xs transition-all duration-300">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Create a new task</h3>
            <form onSubmit={handleAddTask} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Task Title</label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="E.g., Design interface details"
                    className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category</label>
                  <input
                    type="text"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    placeholder="E.g., Design, Frontend, DevOps"
                    className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white transition-colors"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-full text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 select-none">
          <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-2xs">
            <span className="text-xs font-semibold text-gray-400 block">Total Tasks</span>
            <span className="text-2xl font-bold text-gray-900 mt-1 block">{tasks.length}</span>
          </div>
          <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-2xs">
            <span className="text-xs font-semibold text-gray-400 block">Completed Tasks</span>
            <span className="text-2xl font-bold text-[#10b981] mt-1 block">{completedCount}</span>
          </div>
          <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-2xs">
            <span className="text-xs font-semibold text-gray-400 block">Pending Tasks</span>
            <span className="text-2xl font-bold text-[#f59e0b] mt-1 block">{pendingCount}</span>
          </div>
        </div>

        {/* Task List Card */}
        <div className="bg-white border border-gray-200/80 rounded-3xl shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#fafafa]">
            <h2 className="text-sm font-bold text-gray-800">Your Current Tasks</h2>
            <span className="text-xs text-gray-400">{tasks.length} items total</span>
          </div>

          <div className="divide-y divide-gray-100">
            {tasks.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">
                No tasks available. Click &quot;Create Task&quot; to add one.
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-5 flex items-center justify-between gap-4 transition-all duration-200 hover:bg-[#fafafa]/50 ${
                    task.completed ? "bg-[#fafafa]/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        task.completed
                          ? "bg-[#10b981] border-[#10b981] text-white"
                          : "border-gray-300 hover:border-gray-400 text-transparent"
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>

                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-sm font-medium leading-tight truncate ${
                          task.completed ? "text-gray-400 line-through" : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#f3f4f6] text-gray-500 rounded-md">
                          {task.category}
                        </span>
                        {/* Priority Badge */}
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm ${
                            task.priority === "high"
                              ? "bg-red-50 text-red-600"
                              : task.priority === "medium"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
