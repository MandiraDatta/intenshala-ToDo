"use client";

import { PanelLeft, LogOut } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";

interface NavbarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export default function Navbar({ isSidebarOpen, setSidebarOpen }: NavbarProps) {
  const { user } = useUser();

  return (
    <header className="w-full h-[4rem] border-b-2 border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] px-4 sm:px-6 flex items-center justify-between shrink-0 transition-colors duration-200">
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="-ml-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors cursor-pointer text-neutral-600 dark:text-[#F5F5F5] focus:outline-none"
        title="Toggle Sidebar"
      >
        <PanelLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3">
        {user?.fullName && (
          <span className="text-xs font-semibold text-neutral-700 dark:text-[#F5F5F5]">
            {user.fullName}
          </span>
        )}
        <button
          type="button"
          onClick={() => authService.logout()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer border border-red-200 dark:border-red-900/30"
          title="Log Out"
        >
          <LogOut className="w-3.5 h-3.5 stroke-[2]" />
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}
