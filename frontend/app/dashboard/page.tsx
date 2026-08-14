"use client";

import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import TaskHeader from "@/components/taskHeader";
import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";

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
        {/* Top Navbar Component */}
        <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Page Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="h-full w-full gap-5 flex flex-col">
            {/* Tasks Header Component */}
            <TaskHeader />

            {/* Main Content Columns */}
            <div className="w-full h-full flex gap-5 overflow-x-auto">
              {/* todo column */}
              <div className="w-[289px] h-[39px] flex  justify-between p-3 rounded-lg border border-[#E5E5E5]">
                {/* left */}
<div className="w-14 h-3.5 flex items-center gap-2">

  {/* Grip */}
  <div className="w-3.5 h-3.5 flex items-center justify-center">
    <GripVertical className="w-3.5 h-3.5" />
  </div>

  {/* To Do */}
  <div className="w-[34px] h-3 flex items-center">
    <span className="font-sans text-xs font-semibold leading-3 text-[#171717] whitespace-nowrap">
      To Do
    </span>
  </div>

</div>
              </div>

              {/* doing column */}
              <div className="w-[289px] h-[39px] flex justify-between p-3 rounded-lg border border-[#E5E5E5]">
                         {/* left */}
<div className="w-14 h-3.5 flex items-center gap-2">

  {/* Grip */}
  <div className="w-3.5 h-3.5 flex items-center justify-center">
    <GripVertical className="w-3.5 h-3.5" />
  </div>

  {/* To Do */}
  <div className="w-[34px] h-3 flex items-center">
    <span className="font-sans text-xs font-semibold leading-3 text-[#171717] whitespace-nowrap">
      Doing
    </span>
  </div>

</div>
              </div>

              {/* completed column */}
              <div className="w-[289px] h-[39px] flex justify-between p-3 rounded-lg border border-[#E5E5E5]">

                         {/* left */}
<div className="w-14 h-3.5 flex items-center gap-2">

  {/* Grip */}
  <div className="w-3.5 h-3.5 flex items-center justify-center">
    <GripVertical className="w-3.5 h-3.5" />
  </div>

  {/* To Do */}
  <div className="w-[34px] h-3 flex items-center">
    <span className="font-sans text-xs font-semibold leading-3 text-[#171717] whitespace-nowrap">
      Completed
    </span>
  </div>

</div>
              </div>

              {/* on hold column */}
              <div className="w-[289px] h-[39px] flex justify-between p-3 rounded-lg border border-[#E5E5E5]">
                         {/* left */}
<div className="w-14 h-3.5 flex items-center gap-2">

  {/* Grip */}
  <div className="w-3.5 h-3.5 flex items-center justify-center">
    <GripVertical className="w-3.5 h-3.5" />
  </div>

  {/* To Do */}
  <div className="w-[34px] h-3 flex items-center">
    <span className="font-sans text-xs font-semibold leading-3 text-[#171717] whitespace-nowrap">
      On hold
    </span>
  </div>

</div>
              </div>
            </div>
              </div>
        </div>
      </main>
    </div>
  );
}