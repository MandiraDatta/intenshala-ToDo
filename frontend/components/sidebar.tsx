"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronsUpDown,
  LayoutDashboard,
  GalleryVerticalEnd,
  Moon,
  Check,
} from "lucide-react";
import { Sun, Gear, Square } from "@phosphor-icons/react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<"theme" | "color" | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside
      className="
        w-[10rem]
        sm:w-[12rem]
        md:w-[14rem]
        lg:w-[16rem]
        min-h-screen
        shrink-0
        border-r-2 border-[#E5E5E5]
        bg-[#FAFAFA]
        flex flex-col
        relative
      "
    >
      {/* Header Profile Section */}
      <div ref={profileRef} className="relative w-full h-[4rem] flex items-center p-2 border-b border-transparent">
        <div
          onClick={() => {
            setIsProfileOpen(!isProfileOpen);
            setActiveSubmenu(null);
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 min-w-0 hover:bg-[#F5F5F5] transition-colors rounded-xl cursor-pointer select-none"
        >
          {/* Avatar */}
          <div className="w-8 h-8 shrink-0 bg-[#FFFFFF] rounded-2xl overflow-hidden">
            <Image src="/Pasted image.png" alt="Avatar" width={32} height={32} className="rounded-2xl" />
          </div>

          {/* Name */}
          <div className="min-w-0 flex-1 font-sans font-bold text-sm leading-none truncate text-neutral-800">
            Dexter
          </div>

          {/* Profile dropdown icon */}
          <div className="w-4 h-4 shrink-0 flex items-center justify-center">
            <ChevronsUpDown className="w-4 h-4 text-neutral-600" />
          </div>
        </div>

        {/* Profile Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute h-[16.625rem] top-14 left-2 right-2 max-w-[calc(100%-1rem)] bg-white border border-[#E5E5E5] rounded-md shadow-xl p-3.5 flex flex-col z-50">
            {/* Header: User Info */}
            <div className="h-[7.5rem] flex flex-col items-center justify-center pb-3 pt-1">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F5F5F5] flex items-center justify-center shrink-0">
                <Image src="/Pasted image.png" alt="Dexter" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
              </div>
              <span className="font-sans font-semibold text-sm text-[#171717] mt-2 leading-none">
                Dexter
              </span>
              <span className="font-sans text-xs text-[#737373] mt-1 leading-none truncate max-w-full">
                Dexter@gmail.com
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#E5E5E5] my-1" />

            {/* Menu Options */}
            <div className="flex flex-col gap-0.5 pt-1">
              {/* Change Theme */}
              <div
                className="relative w-full"
                onMouseEnter={() => setActiveSubmenu("theme")}
              >
                <button
                  type="button"
                  onClick={() => setActiveSubmenu(activeSubmenu === "theme" ? null : "theme")}
                  className="w-full flex items-center justify-between h-9 px-3 gap-2.5 rounded-2xl hover:bg-[#F5F5F5] text-[#171717] transition-colors cursor-pointer text-left"
                >
                  <Sun size={16} weight="bold" className="text-[#171717] shrink-0" />
                  <span className="font-sans text-xs font-medium flex-1 text-[#171717] truncate">
                    Change Theme
                  </span>
                  <svg className="w-4 h-4 shrink-0 text-[#171717]" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4.5L10.5 8L6 11.5V4.5Z" fill="currentColor" />
                  </svg>
                </button>

                {/* Submenu: Theme Options */}
                {activeSubmenu === "theme" && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E5E5E5] rounded-md shadow-xl p-2 flex flex-col gap-1 z-50">
                    <span className="text-[10px] font-medium text-[#737373] px-2 py-0.5">
                      Theme
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTheme("light");
                        setActiveSubmenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F5F5F5] text-xs text-[#171717] transition-colors cursor-pointer text-left"
                    >
                      <Sun size={14} weight="bold" className="text-[#171717] shrink-0" />
                      <span className="flex-1 text-xs">Light</span>
                      {selectedTheme === "light" && (
                        <Check className="w-3.5 h-3.5 text-[#171717] stroke-[2.5] shrink-0" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTheme("dark");
                        setActiveSubmenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F5F5F5] text-xs text-[#171717] transition-colors cursor-pointer text-left"
                    >
                      <Moon className="w-3.5 h-3.5 text-[#171717] stroke-[2.5] shrink-0" />
                      <span className="flex-1 text-xs">Dark</span>
                      {selectedTheme === "dark" && (
                        <Check className="w-3.5 h-3.5 text-[#171717] stroke-[2.5] shrink-0" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Color Mode */}
              <div
                className="relative w-full"
                onMouseEnter={() => setActiveSubmenu("color")}
              >
                <button
                  type="button"
                  onClick={() => setActiveSubmenu(activeSubmenu === "color" ? null : "color")}
                  className="w-full flex items-center justify-between h-9 px-3 gap-2.5 rounded-2xl hover:bg-[#F5F5F5] text-[#171717] transition-colors cursor-pointer text-left"
                >
                  <Square size={16} weight="fill" className="text-[#171717] shrink-0" />
                  <span className="font-sans text-xs font-medium flex-1 text-[#171717]">
                    Color Mode
                  </span>
                  <svg className="w-4 h-4 shrink-0 text-[#171717]" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4.5L10.5 8L6 11.5V4.5Z" fill="currentColor" />
                  </svg>
                </button>
              </div>

              {/* Settings */}
              <div onMouseEnter={() => setActiveSubmenu(null)}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center justify-between h-9 px-3 gap-2.5 rounded-2xl hover:bg-[#F5F5F5] text-[#171717] transition-colors cursor-pointer text-left"
                >
                  <Gear size={16} weight="bold" className="text-[#171717] shrink-0" />
                  <span className="font-sans text-xs font-medium flex-1 text-[#171717]">
                    Settings
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="w-full flex flex-col p-2">
        {/* Workspace Selector */}
        <div className="w-full h-8 flex items-center px-3">
          {/* Workspace text */}
          <div className="flex-1 min-w-0 font-sans font-medium text-sm truncate text-neutral-800">
            Workspace
          </div>

          {/* Dropdown icon */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-4 h-4 shrink-0 flex items-center justify-center cursor-pointer focus:outline-none"
            aria-label="Toggle Workspace navigation"
          >
            <ChevronDownIcon
              className={`w-4 h-4 text-neutral-600 transition-transform duration-300 ${
                isOpen ? "rotate-0" : "-rotate-180"
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        {isOpen && (
          <div className="w-full flex flex-col gap-1 mt-1">
            {/* Tasks */}
            <div className="w-full h-9 gap-3 px-3 py-2 rounded-xl hover:bg-[#F5F5F5] transition-colors flex items-center cursor-pointer">
              <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-neutral-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-sans font-medium text-sm truncate text-[#171717]">Tasks</span>
              </div>
            </div>

            {/* Projects */}
            <div className="w-full h-9 gap-3 px-3 py-2 rounded-xl hover:bg-[#F5F5F5] transition-colors flex items-center cursor-pointer">
              <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                <GalleryVerticalEnd className="w-4 h-4 text-neutral-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-sans font-medium text-sm truncate text-[#171717]">Projects</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}