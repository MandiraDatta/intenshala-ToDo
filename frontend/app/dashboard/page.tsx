"use client";

import Sidebar from "@/components/sidebar";
import TaskHeader from "@/components/taskHeader";
import { PanelLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar Container */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "w-[10rem] sm:w-[12rem] md:w-[14rem] lg:w-[16rem]"
            : "w-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex flex-col flex-1 min-w-0">
        {/* Navbar Header */}
        <header className="w-full h-[4rem] border-b-2 border-[#E5E5E5] bg-white px-4 sm:px-6 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="-ml-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors cursor-pointer text-neutral-600 focus:outline-none"
            title="Toggle Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </header>

        {/* Main Page Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="h-full w-full gap-5 flex flex-col">
            {/* Tasks Header Component */}
            <TaskHeader />

            {/* Main Content */}
            <div className="w-[60rem] h-[34.875rem] gap-4">
              main
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}