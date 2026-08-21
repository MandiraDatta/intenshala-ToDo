"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronRight, Check, UserPlus } from "lucide-react";
import { FilterConfig, ActiveFilters } from "./types";
import InviteModal from "../common/InviteModal";
import { useWorkspace } from "@/context/WorkspaceContext";

interface FilterMenuProps {
  filters: FilterConfig[];
  activeFilters: ActiveFilters;
  onSelectFilter: (key: string, value: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterMenu({
  filters,
  activeFilters,
  onSelectFilter,
  isOpen,
  onClose,
}: FilterMenuProps) {
  const { myRole } = useWorkspace();
  const [activeSubmenuKey, setActiveSubmenuKey] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeFilterConfig = filters.find((f) => f.key === activeSubmenuKey);

  return (
    <>
      <div
        ref={containerRef}
        className="absolute right-0 top-full mt-1 z-50 flex items-start gap-1 select-none animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Dynamic Submenu (if active) - positioned beside primary menu */}
        {activeFilterConfig && (
          <div className="w-[11.25rem] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl shadow-xl p-1.5 flex flex-col gap-0.5 z-50">
            <div className="px-2 py-1 text-[11px] font-semibold text-[#737373] dark:text-[#A3A3A3] border-b border-[#F0F0F0] dark:border-[#262626] mb-1">
              {activeFilterConfig.label}
            </div>

            {/* Add / Invite Member Action inside Members Submenu */}
            {activeFilterConfig.key === "members" && myRole !== 'MEMBER' && (
              <button
                type="button"
                onClick={() => {
                  setIsInviteModalOpen(true);
                }}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors border-b border-[#F0F0F0] dark:border-[#262626] mb-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0" />
                <span>+ Add / Invite Member</span>
              </button>
            )}

            <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto">
              {activeFilterConfig.options.map((option) => {
                const OptionIcon = option.icon;
                const isSelected = activeFilters[activeFilterConfig.key] === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        onSelectFilter(activeFilterConfig.key, null);
                      } else {
                        onSelectFilter(activeFilterConfig.key, option.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                      isSelected
                        ? "bg-[#F5F5F5] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
                        : "hover:bg-[#FAFAFA] dark:hover:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {OptionIcon && (
                        <OptionIcon
                          className={`w-3.5 h-3.5 shrink-0 ${option.colorClass || "text-neutral-500"}`}
                        />
                      )}
                      <span
                        className={`truncate text-xs ${
                          option.colorClass || "text-[#171717] dark:text-[#F5F5F5]"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 stroke-[2.5] text-[#171717] dark:text-[#F5F5F5] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Primary Filter Menu */}
        <div className="w-[12rem] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl shadow-xl p-1.5 flex flex-col gap-0.5 z-50">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeSubmenuKey === filter.key;
            const hasSelectedValue = !!activeFilters[filter.key];

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => {
                  setActiveSubmenuKey(isActive ? null : filter.key);
                }}
                onMouseEnter={() => {
                  setActiveSubmenuKey(filter.key);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? "bg-[#F5F5F5] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
                    : "hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3] shrink-0" />
                  <span className="truncate text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                    {filter.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {hasSelectedValue && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-[#A3A3A3] dark:text-[#737373]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Invite Modal */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </>
  );
}
