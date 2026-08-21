"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronsUpDown,
  LayoutDashboard,
  GalleryVerticalEnd,
  Moon,
  Check,
  User as UserIcon,
  LogOut,
  Building,
} from "lucide-react";
import { Sun, Gear, Square } from "@phosphor-icons/react";
import { useTheme, COLOR_MODES } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { authService } from "@/services/auth.service";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<"theme" | "color" | null>(null);
  const { theme, setTheme, colorMode, setColorMode } = useTheme();
  const { user } = useUser();
  const { workspaces, activeWorkspace, setActiveWorkspace, myRole } = useWorkspace();
  const profileRef = useRef<HTMLDivElement>(null);
  const wsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setActiveSubmenu(null);
      }
      if (wsDropdownRef.current && !wsDropdownRef.current.contains(event.target as Node)) {
        setIsWsDropdownOpen(false);
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
        w-[13.5rem]
        min-h-screen
        shrink-0
        border-r border-[#E5E5E5] dark:border-[#2A2A2A]
        bg-[#FAFAFA] dark:bg-[#111111]
        flex flex-col justify-between
        relative z-40
        transition-colors duration-200
      "
    >
      <div className="flex flex-col w-full">
        {/* Header Profile Section */}
        <div ref={profileRef} className="relative z-50 w-full h-14 flex items-center p-2 border-b border-transparent">
          <div
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setActiveSubmenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 min-w-0 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors rounded-xl cursor-pointer select-none"
          >
            {/* Avatar */}
            <div className="w-8 h-8 shrink-0 bg-[#FFFFFF] dark:bg-[#171717] rounded-2xl overflow-hidden flex items-center justify-center">
              <Image src={user.avatar || "/Pasted image.png"} alt="Avatar" width={32} height={32} className="w-8 h-8 rounded-2xl object-cover" />
            </div>

            {/* Name */}
            <div className="min-w-0 flex-1 font-sans font-bold text-sm leading-none truncate text-neutral-800 dark:text-[#F5F5F5]">
              {user.fullName || "Dexter"}
            </div>

            {/* Profile dropdown icon */}
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
              <ChevronsUpDown className="w-4 h-4 text-neutral-600 dark:text-[#A3A3A3]" />
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute top-14 left-2 right-2 max-w-[calc(100%-1rem)] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-2xl p-3.5 flex flex-col z-50 transition-colors duration-200">
              {/* Header: User Info (Clicking navigates to /profile) */}
              <Link
                href="/profile"
                onClick={() => setIsProfileOpen(false)}
                className="h-[7.5rem] flex flex-col items-center justify-center pb-3 pt-1 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F5F5F5] dark:bg-[#262626] flex items-center justify-center shrink-0">
                  <Image src={user.avatar || "/Pasted image.png"} alt={user.fullName} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                </div>
                <span className="font-sans font-semibold text-sm text-[#171717] dark:text-[#F5F5F5] mt-2 leading-none">
                  {user.fullName || "Dexter"}
                </span>
                <span className="font-sans text-xs text-[#737373] dark:text-[#A3A3A3] mt-1 leading-none truncate max-w-full">
                  {user.email || "dexter@gmail.com"}
                </span>
              </Link>

              {/* Divider */}
              <div className="w-full h-px bg-[#E5E5E5] dark:bg-[#2A2A2A] my-1" />

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
                    className="w-full flex items-center justify-between h-9 px-3 gap-2.5 rounded-2xl hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer text-left"
                  >
                    <Sun size={16} weight="bold" className="text-[#171717] dark:text-[#F5F5F5] shrink-0" />
                    <span className="font-sans text-xs font-medium flex-1 text-[#171717] dark:text-[#F5F5F5] truncate">
                      Change Theme
                    </span>
                    <svg className="w-4 h-4 shrink-0 text-[#171717] dark:text-[#F5F5F5]" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4.5L10.5 8L6 11.5V4.5Z" fill="currentColor" />
                    </svg>
                  </button>

                  {/* Submenu: Theme Options */}
                  {activeSubmenu === "theme" && (
                    <div className="absolute left-full top-0 ml-1.5 w-48 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-2xl p-2 flex flex-col gap-1 z-50 transition-colors duration-200">
                      <span className="text-[10px] font-medium text-[#737373] dark:text-[#A3A3A3] px-2 py-0.5 select-none">
                        Theme
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTheme("light");
                          setActiveSubmenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-xs text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer text-left"
                      >
                        <Sun size={14} weight="bold" className="text-[#171717] dark:text-[#F5F5F5] shrink-0" />
                        <span className="flex-1 text-xs font-medium">Light</span>
                        {theme === "light" && (
                          <Check className="w-3.5 h-3.5 text-[#171717] dark:text-[#F5F5F5] stroke-[2.5] shrink-0" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTheme("dark");
                          setActiveSubmenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-xs text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer text-left"
                      >
                        <Moon className="w-3.5 h-3.5 text-[#171717] dark:text-[#F5F5F5] shrink-0" />
                        <span className="flex-1 text-xs font-medium">Dark</span>
                        {theme === "dark" && (
                          <Check className="w-3.5 h-3.5 text-[#171717] dark:text-[#F5F5F5] stroke-[2.5] shrink-0" />
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
                    className="w-full flex items-center justify-between h-9 px-3 gap-2.5 rounded-2xl hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer text-left"
                  >
                    <Square size={16} weight="fill" className="text-[#171717] dark:text-[#F5F5F5] shrink-0" />
                    <span className="font-sans text-xs font-medium flex-1 text-[#171717] dark:text-[#F5F5F5]">
                      Color Mode
                    </span>
                    <svg className="w-4 h-4 shrink-0 text-[#171717] dark:text-[#F5F5F5]" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4.5L10.5 8L6 11.5V4.5Z" fill="currentColor" />
                    </svg>
                  </button>

                  {/* Submenu: Color Mode Options */}
                  {activeSubmenu === "color" && (
                    <div className="absolute left-full top-0 ml-1.5 w-48 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-2xl p-2 flex flex-col gap-1 z-50 transition-colors duration-200">
                      <span className="text-[10px] font-medium text-[#737373] dark:text-[#A3A3A3] px-2 py-0.5 select-none">
                        Color Mode
                      </span>
                      {COLOR_MODES.map((mode) => (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => {
                            setColorMode(mode.value);
                            setActiveSubmenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-xs text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer text-left"
                        >
                          <Square
                            size={14}
                            weight="fill"
                            style={{ color: mode.hex }}
                            className="shrink-0 rounded-xs"
                          />
                          <span className="flex-1 text-xs font-medium">{mode.name}</span>
                          {colorMode === mode.value && (
                            <Check className="w-3.5 h-3.5 text-[#171717] dark:text-[#F5F5F5] stroke-[2.5] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div onMouseEnter={() => setActiveSubmenu(null)}>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center justify-between h-9 px-3 gap-2.5 rounded-2xl hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer text-left"
                  >
                    <Gear size={16} weight="bold" className="text-[#171717] dark:text-[#F5F5F5] shrink-0" />
                    <span className="font-sans text-xs font-medium flex-1 text-[#171717] dark:text-[#F5F5F5]">
                      Settings
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="w-full flex flex-col p-1.5">
          {/* Workspace Selector */}
          <div className="w-full h-7 flex items-center px-2.5">
            {/* Workspace text */}
            <div className="flex-1 min-w-0 font-sans font-medium text-xs truncate text-neutral-500 dark:text-[#A3A3A3]">
              Workspace
            </div>

            {/* Dropdown icon */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-4 h-4 shrink-0 flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label="Toggle Workspace navigation"
            >
              <ChevronDownIcon
                className={`w-3.5 h-3.5 text-neutral-500 dark:text-[#A3A3A3] transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-180"
                  }`}
              />
            </button>
          </div>

          {/* Navigation */}
          {isOpen && (
            <div className="w-full flex flex-col gap-0.5 mt-0.5">
              {/* Tasks */}
              <Link
                href="/dashboard"
                className={`w-full h-8 gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors flex items-center cursor-pointer ${
                  pathname === "/dashboard" || pathname.startsWith("/task")
                    ? "bg-[#EAEAEA] dark:bg-[#262626] font-semibold"
                    : "hover:bg-[#F5F5F5] dark:hover:bg-[#262626]"
                }`}
              >
                <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-neutral-600 dark:text-[#A3A3A3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-sans font-medium text-xs truncate text-[#171717] dark:text-[#F5F5F5]">Tasks</span>
                </div>
              </Link>

              {/* Projects */}
              <Link
                href="/projects"
                className={`w-full h-8 gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors flex items-center cursor-pointer ${
                  pathname.startsWith("/projects")
                    ? "bg-[#EAEAEA] dark:bg-[#262626] font-semibold"
                    : "hover:bg-[#F5F5F5] dark:hover:bg-[#262626]"
                }`}
              >
                <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                  <GalleryVerticalEnd className="w-4 h-4 text-neutral-600 dark:text-[#A3A3A3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-sans font-medium text-xs truncate text-[#171717] dark:text-[#F5F5F5]">Projects</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sidebar Logout Button */}
      <div className="p-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A] mt-auto">
        <button
          type="button"
          onClick={() => authService.logout()}
          className="w-full h-9 gap-2.5 px-2.5 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0 stroke-[2]" />
          <span className="font-sans font-semibold text-xs truncate">Log Out</span>
        </button>
      </div>
    </aside>
  );
}