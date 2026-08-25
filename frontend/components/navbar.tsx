"use client";

import Link from "next/link";
import { PanelLeft, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface NavbarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  breadcrumbs?: BreadcrumbItem[];
}

export default function Navbar({ isSidebarOpen, setSidebarOpen, breadcrumbs = [] }: NavbarProps) {
  return (
    <header className="w-full h-14 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] px-4 sm:px-6 flex items-center justify-between shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-2 min-w-0">
        {/* Toggle Sidebar Button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="-ml-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors cursor-pointer text-[#171717] dark:text-[#F5F5F5] focus:outline-none shrink-0"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Vertical Divider Line */}
        {breadcrumbs.length > 0 && (
          <div className="h-4 w-px bg-[#E5E5E5] dark:bg-[#2A2A2A] mx-1 shrink-0" />
        )}

        {/* Breadcrumb Path */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0 text-xs select-none">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={index} className="flex items-center gap-1.5 min-w-0">
                  {index > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#A3A3A3] dark:text-[#737373] stroke-[2.5] shrink-0" />
                  )}
                  {isLast ? (
                    <span className="font-semibold text-[#171717] dark:text-[#F5F5F5] truncate max-w-[200px] sm:max-w-[300px]">
                      {item.label}
                    </span>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      className="font-medium text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors truncate max-w-[150px]"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-[#737373] dark:text-[#A3A3A3] truncate max-w-[150px]">
                      {item.label}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        )}
      </div>

      <div />
    </header>
  );
}
