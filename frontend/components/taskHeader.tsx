"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Columns3, Filter, Plus, List, Grid2x2, Check } from "lucide-react";

export interface VisibleFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

export interface TaskHeaderProps {
  visibleFields?: VisibleFields;
  onToggleField?: (field: keyof VisibleFields) => void;
  onAddTask?: () => void;
  viewMode?: "board" | "list";
  onViewModeChange?: (mode: "board" | "list") => void;
}

export default function TaskHeader({
  visibleFields: propVisibleFields,
  onToggleField,
  onAddTask,
  viewMode = "board",
  onViewModeChange,
}: TaskHeaderProps) {
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "board">(viewMode);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync active tab with prop if viewMode changes from parent
  useEffect(() => {
    setActiveTab(viewMode);
  }, [viewMode]);

  // Local fields state initialized with defaults or passed props
  const [localFields, setLocalFields] = useState<VisibleFields>({
    priority: false,
    members: true,
    dueDate: true,
    labels: true,
    status: false,
    reporter: false,
    ...propVisibleFields,
  });

  // Sync internal state when parent prop updates
  useEffect(() => {
    if (propVisibleFields) {
      setLocalFields(propVisibleFields);
    }
  }, [propVisibleFields]);

  const handleTabChange = (mode: "list" | "board") => {
    setActiveTab(mode);
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
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
      <h1 className="text-base font-semibold text-neutral-900">Tasks</h1>

      {/* Action Buttons Group */}
      <div className="flex items-center gap-2">
        {/* Search Button */}
        <button
          className="w-8 h-8 py-2 px-1.5 flex items-center justify-center border border-[#E5E5E5] rounded text-black hover:bg-neutral-100 transition-colors cursor-pointer focus:outline-none"
          title="Search"
          type="button"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Fields Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsFieldsOpen(!isFieldsOpen)}
            className={`w-8 md:w-[4.875rem] h-8 px-2.5 flex items-center justify-center gap-1.5 border border-[#E5E5E5] rounded text-xs font-medium transition-colors cursor-pointer focus:outline-none ${isFieldsOpen ? "bg-neutral-100 border-neutral-400" : "bg-white hover:bg-neutral-100 text-neutral-700"
              }`}
            title="Fields"
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
              <Columns3 className="w-3.5 h-3.5 text-[#171717]" />
            </span>
            <span className="hidden md:flex items-center text-xs font-medium leading-4 text-[#171717]">
              Fields
            </span>
          </button>

          {/* Figma Popover Menu for Fields */}
          {isFieldsOpen && (
            <div className="absolute right-0 mt-1 w-[18.6875rem] h-[19.25rem] bg-white border border-[#E5E5E5] rounded-xl shadow-xl z-50 p-4 flex flex-col gap-4">
              {/* Segmented Control Tabs: List vs Board */}
              <div className="w-[16.6875rem] h-[2.25rem] flex rounded-lg border border-[#E5E5E5] overflow-hidden bg-[#F5F5F5] shrink-0">
                <button
                  type="button"
                  onClick={() => handleTabChange("list")}
                  className={`flex-1 h-full flex items-center justify-center gap-2 text-xs font-medium transition-colors border-r border-[#E5E5E5] ${activeTab === "list"
                      ? "bg-white text-[#171717]"
                      : "bg-[#F5F5F5] text-[#737373] hover:text-[#171717]"
                    }`}
                >
                  <List size={14} />
                  List
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("board")}
                  className={`flex-1 h-full flex items-center justify-center gap-2 text-xs font-medium transition-colors ${activeTab === "board"
                      ? "bg-white text-[#171717]"
                      : "bg-[#F5F5F5] text-[#737373] hover:text-[#171717]"
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
                      className="flex h-8 items-center justify-between px-2.5 py-1.5 hover:bg-[#F5F5F5] rounded-md text-xs font-medium text-[#171717] transition-colors cursor-pointer w-full text-left"
                    >
                      <span className="text-xs font-sans h-4 text-[#171717]">{label}</span>
                      <div
                        className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${isChecked ? "bg-[#171717] text-white" : "border border-[#D4D4D4] bg-white"
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
          className="w-8 h-8 py-2 px-1.5 rounded border border-[#E5E5E5] hover:bg-neutral-100 transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
          title="Filter"
          type="button"
        >
          <Filter className="w-3.5 h-3.5 text-[#171717]" />
        </button>

        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          className="w-8 md:w-24 h-8 px-1.5 py-2 flex items-center justify-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-medium transition-colors cursor-pointer focus:outline-none shadow-sm"
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
