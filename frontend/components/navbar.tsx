"use client";

import { PanelLeft } from "lucide-react";

interface NavbarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export default function Navbar({ isSidebarOpen, setSidebarOpen }: NavbarProps) {
  return (
    <header className="w-full h-[4rem] border-b-2 border-[#E5E5E5] bg-white px-4 sm:px-6 flex items-center justify-between shrink-0">
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="-ml-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors cursor-pointer text-neutral-600 focus:outline-none"
        title="Toggle Sidebar"
      >
        <PanelLeft className="w-4 h-4" />
      </button>
    </header>
  );
}
