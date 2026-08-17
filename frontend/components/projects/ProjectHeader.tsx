"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Columns3,
  Filter,
  Plus,
  List as ListIcon,
  Grid2x2 as BoardIcon,
  Command,
} from "lucide-react";
import FilterMenu from "./FilterMenu";
import FieldsMenu from "./FieldsMenu";
import { FilterConfig, ActiveFilters, VisibleFields } from "./types";
import { useTheme } from "@/context/ThemeContext";

interface ProjectHeaderProps {
  viewMode: "list" | "board";
  onViewModeChange: (mode: "list" | "board") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  visibleFields: VisibleFields;
  onToggleField: (field: keyof VisibleFields) => void;
  filterConfigs: FilterConfig[];
  activeFilters: ActiveFilters;
  onSelectFilter: (key: string, value: string | null) => void;
  onAddProject: () => void;
}

export default function ProjectHeader({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  visibleFields,
  onToggleField,
  filterConfigs,
  activeFilters,
  onSelectFilter,
  onAddProject,
}: ProjectHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { currentColorHex } = useTheme();

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle keyboard shortcut (Cmd+F or Ctrl+F) and Escape key
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

  const activeFilterCount = Object.values(activeFilters).filter(
    (v) => v && !v.startsWith("All ")
  ).length;

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 py-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] transition-colors">
      {/* Title */}
      <h1 className="text-xl font-semibold tracking-tight text-[#171717] dark:text-[#F5F5F5]">
        Projects
      </h1>

      {/* Action Buttons Group */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search Bar / Icon */}
        {isSearchOpen ? (
          <div className="w-64 sm:w-80 h-8 flex items-center gap-2 px-2.5 bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                onSearchChange("");
              }}
              className="text-[#171717] dark:text-[#F5F5F5] hover:opacity-70 transition-opacity p-0.5"
              title="Close Search"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 text-xs font-semibold outline-none bg-transparent text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] dark:placeholder:text-[#737373]"
            />
            <kbd className="h-5 px-1.5 flex items-center gap-0.5 text-[10px] font-bold text-[#525252] dark:text-[#A3A3A3] bg-[#F5F5F5] dark:bg-[#262626] rounded border border-[#E5E5E5] dark:border-[#2A2A2A] select-none shrink-0">
              <Command className="w-3 h-3 stroke-[2.5]" />
              <span>F</span>
            </kbd>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="h-8 px-2.5 flex items-center gap-1.5 border border-[#E5E5E5] dark:border-[#2A2A2A] rounded bg-white dark:bg-[#171717] text-[#171717] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors cursor-pointer text-xs font-medium"
            title="Search projects (Cmd+F)"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.2]" />
            <span className="hidden sm:inline">Search</span>
          </button>
        )}

        {/* Fields Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsFieldsOpen(!isFieldsOpen);
              setIsFilterOpen(false);
            }}
            className={`h-8 px-2.5 flex items-center gap-1.5 border border-[#E5E5E5] dark:border-[#2A2A2A] rounded text-xs font-medium transition-colors cursor-pointer ${
              isFieldsOpen
                ? "bg-[#F5F5F5] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
                : "bg-white dark:bg-[#171717] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
            }`}
            title="Fields"
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fields</span>
          </button>
          <FieldsMenu
            visibleFields={visibleFields}
            onToggleField={onToggleField}
            isOpen={isFieldsOpen}
            onClose={() => setIsFieldsOpen(false)}
          />
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsFieldsOpen(false);
            }}
            className={`h-8 px-2.5 flex items-center gap-1.5 border border-[#E5E5E5] dark:border-[#2A2A2A] rounded text-xs font-medium transition-colors cursor-pointer ${
              isFilterOpen || activeFilterCount > 0
                ? "bg-[#F5F5F5] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
                : "bg-white dark:bg-[#171717] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
            }`}
            title="Filter"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <FilterMenu
            filters={filterConfigs}
            activeFilters={activeFilters}
            onSelectFilter={onSelectFilter}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>

        {/* View Switcher: List vs Board */}
        <div className="h-8 flex rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] p-0.5 bg-[#F5F5F5] dark:bg-[#111111] shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`h-full px-2.5 flex items-center gap-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-white dark:bg-[#171717] text-[#171717] dark:text-[#F5F5F5] shadow-xs"
                : "text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5]"
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("board")}
            className={`h-full px-2.5 flex items-center gap-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              viewMode === "board"
                ? "bg-white dark:bg-[#171717] text-[#171717] dark:text-[#F5F5F5] shadow-xs"
                : "text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5]"
            }`}
          >
            <BoardIcon className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
        </div>

        {/* Add Project Button */}
        <button
          type="button"
          onClick={onAddProject}
          style={{ backgroundColor: currentColorHex }}
          className="h-8 px-3 flex items-center gap-1.5 text-white rounded-md text-xs font-semibold transition-all cursor-pointer shadow-xs hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add Project</span>
        </button>
      </div>
    </div>
  );
}
