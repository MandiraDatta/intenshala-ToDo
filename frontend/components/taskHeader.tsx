"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Columns3, Filter, Plus, List, Grid2x2, Check, Command } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface VisibleFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

interface TaskHeaderProps {
  viewMode: "board" | "list";
  onViewModeChange: (mode: "board" | "list") => void;
  visibleFields: VisibleFields;
  onToggleField?: (field: keyof VisibleFields) => void;
  onAddTask?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function TaskHeader({
  viewMode,
  onViewModeChange,
  visibleFields,
  onToggleField,
  onAddTask,
  searchQuery = "",
  onSearchChange,
}: TaskHeaderProps) {
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Synchronize local activeTab state with external viewMode prop
  const [activeTab, setActiveTab] = useState<"board" | "list">(viewMode);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Sync internal state if prop changes
  useEffect(() => {
    setActiveTab(viewMode);
  }, [viewMode]);

  // Keep track of checkmark toggles locally
  const [localFields, setLocalFields] = useState<VisibleFields>(visibleFields);

  // Access dynamic accent color from theme context
  const { currentColorHex } = useTheme();

  useEffect(() => {
    setLocalFields(visibleFields);
  }, [visibleFields]);

  // Tab switcher handler
  const handleTabChange = (tab: "board" | "list") => {
    setActiveTab(tab);
    onViewModeChange(tab);
  };

  // Handle toggling checkmarks on click
  const handleToggle = (key: keyof VisibleFields) => {
    setLocalFields((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    if (onToggleField) {
      onToggleField(key);
    }
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFieldsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard shortcut for Cmd+F / Ctrl+F and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  const fieldsList: { key: keyof VisibleFields; label: string }[] = [
    { key: "priority", label: "Priority" },
    { key: "members", label: "Members" },
    { key: "dueDate", label: "Due Date" },
    { key: "labels", label: "Labels" },
    { key: "status", label: "Status" },
    { key: "reporter", label: "Reporter" },
  ];

  return (
    <div className="w-full flex items-center justify-between gap-4 py-1 relative">
      {/* Tasks Title */}
      <h1 className="text-base font-semibold text-neutral-900 dark:text-[#F5F5F5]">Tasks</h1>

      {/* Action Buttons Group */}
      <div className="flex items-center gap-2">
        {/* Dynamic Expandable Search Input / Button */}
        {isSearchOpen ? (
          <div className="w-[373px] h-8 flex items-center gap-2 px-2.5 bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md transition-all shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                if (onSearchChange) onSearchChange("");
              }}
              className="text-[#171717] dark:text-[#F5F5F5] hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center p-0.5 -ml-0.5 rounded"
              title="Close Search"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Design Homepage"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="flex-1 text-xs font-semibold outline-none bg-transparent text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#525252] dark:placeholder:text-[#A3A3A3] placeholder:font-medium"
            />
            <kbd className="h-5 px-1.5 flex items-center gap-0.5 text-[11px] font-bold text-[#525252] dark:text-[#A3A3A3] bg-[#F5F5F5] dark:bg-[#262626] rounded border border-[#E5E5E5] dark:border-[#2A2A2A] select-none shrink-0">
              <Command className="w-3 h-3 stroke-[2.5] text-[#525252] dark:text-[#A3A3A3]" />
              <span className="font-bold">F</span>
            </kbd>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 flex items-center justify-center border border-[#E5E5E5] dark:border-[#2A2A2A] rounded bg-white dark:bg-[#171717] text-[#171717] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors cursor-pointer focus:outline-none"
            title="Open Search"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        )}

        {/* Fields Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsFieldsOpen(!isFieldsOpen)}
            className={`w-8 md:w-[4.875rem] h-8 px-2.5 flex items-center justify-center gap-1.5 border border-[#E5E5E5] dark:border-[#2A2A2A] rounded text-xs font-medium transition-colors cursor-pointer focus:outline-none ${isFieldsOpen
              ? "bg-neutral-100 dark:bg-[#262626] border-neutral-400 dark:border-neutral-600"
              : "bg-white dark:bg-[#171717] hover:bg-neutral-100 dark:hover:bg-[#262626] text-neutral-700 dark:text-[#F5F5F5]"
              }`}
            title="Fields"
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
              <Columns3 className="w-3.5 h-3.5 text-[#171717] dark:text-[#F5F5F5]" />
            </span>
            <span className="hidden md:flex items-center text-xs font-medium leading-4 text-[#171717] dark:text-[#F5F5F5]">
              Fields
            </span>
          </button>

          {/* Figma Popover Menu for Fields */}
          {isFieldsOpen && (
            <div className="absolute right-0 mt-1 w-[18.6875rem] h-[19.25rem] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl shadow-xl z-50 p-4 flex flex-col gap-4">
              {/* Segmented Control Tabs: List vs Board */}
              <div className="w-[16.6875rem] h-[2.25rem] flex rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] overflow-hidden bg-[#F5F5F5] dark:bg-[#111111] shrink-0">
                <button
                  type="button"
                  onClick={() => handleTabChange("list")}
                  className={`flex-1 h-full flex items-center justify-center gap-2 text-xs font-medium transition-colors border-r border-[#E5E5E5] dark:border-[#2A2A2A] ${activeTab === "list"
                    ? "bg-white dark:bg-[#171717] text-[#171717] dark:text-[#F5F5F5]"
                    : "bg-[#F5F5F5] dark:bg-[#111111] text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5]"
                    }`}
                >
                  <List size={14} />
                  List
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("board")}
                  className={`flex-1 h-full flex items-center justify-center gap-2 text-xs font-medium transition-colors ${activeTab === "board"
                    ? "bg-white dark:bg-[#171717] text-[#171717] dark:text-[#F5F5F5]"
                    : "bg-[#F5F5F5] dark:bg-[#111111] text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5]"
                    }`}
                >
                  <Grid2x2 size={14} />
                  Board
                </button>
              </div>

              {/* Fields Checkbox List */}
              <div className="flex flex-col gap-0.5">
                {fieldsList.map(({ key, label }) => {
                  const isChecked = !!localFields[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleToggle(key)}
                      className="flex h-8 items-center justify-between px-2.5 py-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-md text-xs font-medium text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer w-full text-left"
                    >
                      <span className="text-xs font-sans h-4 text-[#171717] dark:text-[#F5F5F5]">{label}</span>
                      <div
                        className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${isChecked
                          ? "bg-[#171717] dark:bg-[#F5F5F5] text-white dark:text-black"
                          : "border border-[#D4D4D4] dark:border-[#2A2A2A] bg-white dark:bg-[#111111]"
                          }`}
                      >
                        {isChecked && <Check size={10} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Filter Button */}
        <button
          className="w-8 h-8 py-2 px-1.5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
          title="Filter"
          type="button"
        >
          <Filter className="w-3.5 h-3.5 text-[#171717] dark:text-[#F5F5F5]" />
        </button>

        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          style={{ backgroundColor: currentColorHex }}
          className="w-8 md:w-24 h-8 px-1.5 py-2 flex items-center justify-center gap-1 text-white rounded-md text-xs font-medium transition-all cursor-pointer focus:outline-none shadow-sm hover:opacity-90"
          title="Add task"
          type="button"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:flex font-sans font-medium text-xs leading-4 tracking-normal align-middle text-[#FAFAFA]">
            Add Task
          </span>
        </button>
      </div>
    </div>
  );
}
