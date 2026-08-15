"use client";

import React from "react";
import { Calendar, Tag, MoreHorizontal, AlertCircle } from "lucide-react";
import { Task } from "./kanbanColumn";
import { VisibleFields } from "./taskHeader";

export interface TaskCardProps {
  task: Task;
  visibleFields?: VisibleFields;
  onMoreOptions?: (task: Task) => void;
  className?: string;
}

export default function TaskCard({
  task,
  visibleFields = {
    priority: false,
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
  const tags = task.tags && task.tags.length > 0 ? task.tags : ["Deployment", "Deployment"];
  const priority = task.priority || "High";

  const showMembers = visibleFields.members !== false;
  const showDueDate = visibleFields.dueDate !== false;
  const showLabels = visibleFields.labels !== false && tags.length > 0;
  const showPriority = visibleFields.priority === true;
  const showMiddleRow = showMembers || showDueDate || showPriority;

  return (
    <div
      className={`w-full min-h-[7.125rem] flex flex-col justify-between gap-2 p-3 rounded-md border border-[#E5E5E5] bg-white shadow-xs hover:border-[#D4D4D4] transition-all cursor-pointer ${className}`}
    >
      {/* Top Row: Task Title + More Options */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-sans text-xs font-semibold text-[#171717] leading-tight line-clamp-2 break-words">
          {task.title}
        </h4>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoreOptions?.(task);
          }}
          className="text-[#A3A3A3] hover:text-[#171717] transition-colors p-0.5 shrink-0"
          aria-label="Card options"
        >
          <MoreHorizontal size={14} />
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
              <span className="font-sans text-[11px] font-medium text-[#404040] truncate">
                {assigneeName}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Priority Badge */}
            {showPriority && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#D97706] text-[10px] font-medium">
                <AlertCircle size={10} />
                <span>{priority}</span>
              </div>
            )}

            {/* Due Date Pill */}
            {showDueDate && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#EF4444] shrink-0">
                <Calendar size={11} className="text-[#EF4444]" />
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
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#525252] font-sans text-[10px] font-medium max-w-full truncate"
            >
              <Tag size={10} className="text-[#737373] shrink-0" />
              <span className="truncate">{tag}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
