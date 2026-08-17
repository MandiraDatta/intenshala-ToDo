"use client";

import { X } from "lucide-react";
import { ActiveFilters, FilterConfig } from "./types";

interface ActiveFilterChipsProps {
  activeFilters: ActiveFilters;
  filterConfigs: FilterConfig[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilterChips({
  activeFilters,
  filterConfigs,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterChipsProps) {
  const activeEntries = Object.entries(activeFilters).filter(
    ([, val]) => val && !val.startsWith("All ")
  );

  if (activeEntries.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap py-1 select-none">
      <span className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3]">
        Active Filters:
      </span>

      {activeEntries.map(([key, value]) => {
        const config = filterConfigs.find((f) => f.key === key);
        const label = config ? config.label : key;

        return (
          <div
            key={key}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-full text-xs font-medium text-[#171717] dark:text-[#F5F5F5]"
          >
            <span>
              <span className="text-[#737373] dark:text-[#A3A3A3]">{label}: </span>
              {value}
            </span>
            <button
              type="button"
              onClick={() => onRemoveFilter(key)}
              className="text-[#737373] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors p-0.5 rounded-full"
              title={`Remove ${label} filter`}
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        );
      })}

      {activeEntries.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors ml-1 cursor-pointer underline underline-offset-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
