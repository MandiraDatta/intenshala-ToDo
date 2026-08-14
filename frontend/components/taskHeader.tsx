"use client";

import { Search, Columns3, Filter, Plus } from "lucide-react";

export default function TaskHeader() {
  return (
    <div className="w-full flex items-center justify-between gap-4 py-1">
      {/* Tasks Title */}
      <h1 className="text-base font-semibold text-neutral-900">Tasks</h1>

      {/* Action Buttons Group */}
      <div className="flex items-center gap-2">
        {/* Search Button */}
        <button
          className="w-8 h-8 gap-1.5 py-2 px-1.5 flex items-center justify-center border border-[#E5E5E5] rounded text-black hover:bg-neutral-100 transition-colors cursor-pointer focus:outline-none"
          title="Search"
        >
          <Search className="w-[0.875rem] h-[0.875rem]" />
        </button>

        {/* Fields Button */}
        <button
          className="w-8 md:w-[4.875rem] h-8 px-2.5 flex items-center justify-center gap-1.5 border border-[#E5E5E5] rounded text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer focus:outline-none"
          title="Fields"
        >
          {/* Icon container */}
          <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
            <Columns3 className="w-3.5 h-3.5 text-[#171717]" />
          </span>

          {/* Text container */}
          <span className="hidden md:flex w-[2.125rem] h-4 items-center text-xs font-medium leading-4 text-[#171717]">
            Fields
          </span>
        </button>

        {/* Filter Button */}
        <button
          className="w-8 h-8 gap-1.5 py-2 px-1.5 rounded border border-[#E5E5E5] hover:bg-neutral-100 transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
          title="Filter"
        >
          <Filter className="w-3.5 h-3.5 text-[#171717]" />
        </button>

        {/* Add Task Button */}
        <button
          className="w-8 md:w-24 h-8 px-1.5 py-2 flex items-center justify-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-medium transition-colors cursor-pointer focus:outline-none shadow-sm"
          title="Add task"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />

          {/* Text container */}
          <span className="hidden md:flex font-sans font-medium text-xs leading-4 tracking-normal align-middle text-[#FAFAFA]">
            Add Task
          </span>
        </button>
      </div>
    </div>
  );
}
