"use client";

import Link from "next/link";
import { SignalLow, SignalMedium, SignalHigh, Calendar, Tag, MoreHorizontal } from "lucide-react";
import { VisibleFields } from "./taskHeader";
import MemberAvatarStack from "@/components/common/MemberAvatarStack";

export interface TaskCardProps {
  task: {
    id: string;
    title: string;
    priority?: string;
    assignee?: string | { name: string; avatar?: string };
    members?: any[];
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
  const assigneeName = typeof task.assignee === "string" ? task.assignee : task.assignee?.name;
  const dueDate = task.dueDate;
  const priority = task.priority || "Medium";
  const tags = task.tags || [];

  const { priority: showPriority, members: showMembers, dueDate: showDueDate, labels: showLabels } = visibleFields;

  const showMiddleRow = showMembers || showPriority || (showDueDate && !!dueDate);

  return (
    <Link
      href="/task"
      draggable={false}
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
            <MemberAvatarStack
              taskId={task.id}
              members={
                Array.isArray(task.members) && task.members.length > 0
                  ? task.members.map((m: any) => ({
                      id: m.id || m.userId,
                      name: m.fullName || m.name || m.username || "Member",
                      avatar: m.avatarUrl || m.avatar,
                      initials: (m.fullName || m.username || "M")[0].toUpperCase(),
                    }))
                  : assigneeName
                  ? [{ id: assigneeName, name: assigneeName, initials: assigneeName.charAt(0).toUpperCase() }]
                  : []
              }
            />
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
            {showDueDate && dueDate && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F5F5F5] dark:bg-[#262626] text-[#737373] dark:text-[#A3A3A3]">
                <Calendar size={10} />
                <span>{dueDate}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Row: Tags */}
      {showLabels && tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {tags.map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F5F5F5] dark:bg-[#262626] text-[#737373] dark:text-[#A3A3A3] border border-[#E5E5E5] dark:border-[#2A2A2A]"
            >
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
