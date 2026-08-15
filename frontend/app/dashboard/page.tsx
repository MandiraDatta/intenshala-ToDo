"use client";

import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import TaskHeader from "@/components/taskHeader";
import KanbanColumn, { Task } from "@/components/kanbanColumn";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // State to manage Add Task form/modal visibility and targeted column ID
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  // Example column data state
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do", tasks: [] as Task[] },
    { id: "doing", title: "Doing", tasks: [] as Task[] },
    { id: "completed", title: "Completed", tasks: [] as Task[] },
    { id: "on-hold", title: "On hold", tasks: [] as Task[] },
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

  // Opens the Add Task form/modal for the current column
  const handleAddTask = (columnId?: string) => {
    if (columnId) {
      setActiveColumnId(columnId);
      setIsAddTaskOpen(true);
      console.log(`Opening Add Task form for column ID: ${columnId}`);
    }
  };

  const handleCloseModal = () => {
    setIsAddTaskOpen(false);
    setActiveColumnId(null);
  };

  const handleMoreOptions = (columnId?: string) => {
    console.log(`More options requested for column: ${columnId}`);
  };

  const activeColumn = columns.find((c) => c.id === activeColumnId);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar Container */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen
          ? "w-[10rem] sm:w-[12rem] md:w-[14rem] lg:w-[16rem]"
          : "w-0"
          }`}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex flex-col flex-1 min-w-0">
        {/* Top Navbar Component */}
        <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Page Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="h-full w-full gap-5 flex flex-col">
            {/* Tasks Header Component */}
            <TaskHeader />

            {/* Main Content Columns */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {columns.map((col) => (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  tasks={col.tasks}
                  onAddTask={() => handleAddTask(col.id)}
                  onMoreOptions={() => handleMoreOptions(col.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal / Form (Opens when handleAddTask is triggered) */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-lg w-full max-w-md p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-sm font-semibold text-[#171717]">
                Add Task ({activeColumn?.title || activeColumnId})
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-[#737373] hover:text-[#171717] transition-colors p-1"
                type="button"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="text-xs text-[#737373]">
                Target Column ID: <span className="font-mono font-medium text-[#171717]">{activeColumnId}</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#171717]">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title..."
                  className="w-full px-3 py-2 text-xs border border-[#E5E5E5] rounded focus:outline-none focus:border-[#171717]"
                  disabled
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
              <button
                onClick={handleCloseModal}
                type="button"
                className="px-3 py-1.5 text-xs font-medium text-[#171717] border border-[#E5E5E5] rounded hover:bg-[#F5F5F5] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}