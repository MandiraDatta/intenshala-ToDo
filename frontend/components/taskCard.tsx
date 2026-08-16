"use client";

import Link from "next/link";
import { SignalLow, SignalMedium, SignalHigh, Calendar, Tag, MoreHorizontal } from "lucide-react";
import { VisibleFields } from "./taskHeader";

export interface TaskCardProps {
  task: {
    id: string;
    title: string;
    priority?: string;
    assignee?: { name: string; avatar?: string };
    dueDate?: string;
    tags?: string[];
  };
  visibleFields?: VisibleFields;
  onMoreOptions?: (task: TaskCardProps["task"]) => void;
  className?: string;
}

export default function TaskCard({
  task,
  visibleFields = {
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: false,
    reporter: false,
  },
  onMoreOptions,
  className = "",
}: TaskCardProps) {
  const assigneeName = task.assignee?.name || "Admin";
  const dueDate = task.dueDate || "29 Jul";
  const priority = task.priority || "High";
  const tags = task.tags || ["Deployment", "Deployment"];

  const { priority: showPriority, members: showMembers, dueDate: showDueDate, labels: showLabels } = visibleFields;

  const showMiddleRow = showMembers || showPriority || showDueDate;

  return (
    <Link
      href="/task"
      className={`w-full min-h-[7.125rem] flex flex-col justify-between gap-2 p-3 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#171717] shadow-xs hover:border-[#D4D4D4] dark:hover:border-neutral-600 transition-all cursor-pointer ${className}`}
    >
      {/* Top Row: Task Title + More Options */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-sans text-xs font-semibold text-[#171717] dark:text-[#F5F5F5] leading-tight line-clamp-2 break-words">
          {task.title}
        </h4>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoreOptions?.(task);
          }}
          className="text-[#171717] dark:text-[#A3A3A3] hover:text-black dark:hover:text-[#F5F5F5] transition-colors p-0.5 shrink-0 cursor-pointer"
          aria-label="Card options"
        >
          <MoreHorizontal className="w-4 h-4 text-[#171717] dark:text-[#A3A3A3]" />
        </button>
      </div>

      {/* Middle Row: Assignee Avatar + Priority + Due Date Pill */}
      {showMiddleRow && (
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Members / Assignee */}
          {showMembers && (
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[9px] font-bold text-white shadow-xs shrink-0">
                {assigneeName.charAt(0)}
              </div>
              <span className="font-sans text-[11px] font-medium text-[#404040] dark:text-[#A3A3A3] truncate">
                {assigneeName}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Priority Badge */}
            {showPriority && (
              <div className="flex items-center gap-1 text-[10px] font-medium">
                {priority.toLowerCase() === "low" ? (
                  <span className="flex items-center gap-1 text-[#94A3B8] dark:text-slate-400">
                    <SignalLow size={10} className="text-[#94A3B8] dark:text-slate-400" />
                    Low
                  </span>
                ) : priority.toLowerCase() === "medium" ? (
                  <span className="flex items-center gap-1 text-[#F97316] dark:text-orange-400">
                    <SignalMedium size={10} className="text-[#F97316] dark:text-orange-400" />
                    Medium
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#EF4444] dark:text-red-400">
                    <SignalHigh size={10} className="text-[#EF4444] dark:text-red-400" />
                    High
                  </span>
                )}
              </div>
            )}

            {/* Due Date Pill */}
            {showDueDate && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF2F2] dark:bg-rose-950/40 border border-transparent dark:border-rose-900/50 text-[#EF4444] dark:text-rose-400 shrink-0">
                <Calendar size={11} className="text-[#EF4444] dark:text-rose-400" />
                <span className="font-sans text-[10px] font-medium leading-none">
                  {dueDate}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Row: Labels / Tags */}
      {showLabels && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F5F5F5] dark:bg-[#262626] border border-transparent dark:border-[#2A2A2A] text-[#525252] dark:text-[#A3A3A3] font-sans text-[10px] font-medium max-w-full truncate"
            >
              <Tag size={10} className="text-[#737373] dark:text-[#A3A3A3] shrink-0" />
              <span className="truncate">{tag}</span>
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
