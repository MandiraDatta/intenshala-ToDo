"use client";

import Link from "next/link";
import { GripVertical, Plus, SignalHigh, SignalMedium, SignalLow, MoreHorizontal, ChevronDown } from "lucide-react";
import TaskCard from "./taskCard";
import { VisibleFields } from "./taskHeader";

export interface Task {
  id: string;
  title: string;
  assignee?: { name: string; avatar?: string };
  dueDate?: string;
  priority?: string;
  tags?: string[];
}

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  children?: React.ReactNode;
  visibleFields?: VisibleFields;
  isListMode?: boolean;
  onAddTask?: (columnId?: string) => void;
  onMoreOptions?: (columnId?: string) => void;
  renderTaskCard?: (task: Task) => React.ReactNode;
  className?: string;
}

export default function KanbanColumn({
  id,
  title,
  tasks,
  children,
  visibleFields,
  isListMode = false,
  onAddTask,
  onMoreOptions,
  renderTaskCard,
  className = "",
}: KanbanColumnProps) {
  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask(id);
    }
  };

  // Render in List Accordion Mode matching Figma reference design
  if (isListMode) {
    return (
      <div className={`w-full flex flex-col gap-2 ${className}`}>
        {/* Section Header: Lucide ChevronDown + Section Title */}
        <div className="flex items-center gap-1.5 py-1 text-[#171717] dark:text-[#F5F5F5] font-bold text-xs cursor-pointer select-none">
          <ChevronDown className="w-3.5 h-3.5 text-[#171717] dark:text-[#F5F5F5] stroke-[2.5]" />
          <span>{title}</span>
        </div>

        {/* List View Table Container */}
        {tasks.length > 0 && (
          <div className="w-full overflow-x-auto border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#171717] shadow-xs">
            <div className="min-w-[36rem] flex flex-col">
              {/* Table Header Row */}
              <div className="w-full h-11 flex items-center px-5 bg-[#F5F5F5] dark:bg-[#181818] border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-semibold text-[#404040] dark:text-[#D4D4D4]">
                <div className="flex-1 min-w-[10rem] text-[#171717] dark:text-[#F5F5F5] shrink-0 flex items-center pr-2">
                  Task
                </div>
                <div className="flex-1 min-w-[18rem] grid grid-cols-4 text-[#171717] dark:text-[#F5F5F5] items-center gap-2">
                  <div className="flex items-center min-w-0">Priority</div>
                  <div className="flex items-center min-w-0">Members</div>
                  <div className="flex items-center min-w-0">Due Date</div>
                  <div className="flex items-center justify-end">Actions</div>
                </div>
              </div>

              {/* Table Task Rows */}
              {tasks.map((task, index) => {
                const assigneeName = task.assignee?.name || "Admin";
                const dueDate = task.dueDate || "12 Sep 2026";
                const priority = task.priority || "High";

                return (
                  <div
                    key={task.id}
                    className={`w-full h-12 flex items-center px-5 transition-colors text-xs text-[#171717] dark:text-[#F5F5F5] ${index !== tasks.length - 1 ? "border-b border-[#F0F0F0] dark:border-[#2A2A2A]" : ""
                      } hover:bg-[#FAFAFA] dark:hover:bg-[#202020]`}
                  >
                    {/* Task Title */}
                    <div className="flex-1 min-w-[10rem] shrink-0 font-medium truncate pr-2 flex items-center">
                      <Link href="/task" className="hover:underline cursor-pointer truncate text-[#171717] dark:text-[#F5F5F5]">
                        {task.title}
                      </Link>
                    </div>

                    {/* Remaining Columns */}
                    <div className="flex-1 min-w-[18rem] grid grid-cols-4 items-center gap-2">
                      {/* Priority */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        {priority.toLowerCase() === "low" ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-[#94A3B8] dark:text-slate-400 truncate">
                            <SignalLow size={12} className="text-[#94A3B8] shrink-0 stroke-[2.5]" />
                            Low
                          </span>
                        ) : priority.toLowerCase() === "medium" ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-[#F97316] dark:text-orange-400 truncate">
                            <SignalMedium size={12} className="text-[#F97316] shrink-0 stroke-[2.5]" />
                            Medium
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#EF4444] dark:text-red-400 truncate">
                            <SignalHigh size={12} className="text-[#EF4444] shrink-0 stroke-[2.5]" />
                            High
                          </span>
                        )}
                      </div>

                      {/* Members */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-xs">
                          {assigneeName.charAt(0)}
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="text-xs text-[#404040] dark:text-[#D4D4D4] flex items-center min-w-0 truncate">
                        {dueDate}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end shrink-0">
                        <button
                          type="button"
                          onClick={() => onMoreOptions?.(id)}
                          className="text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-[#F5F5F5] transition-colors p-1 cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render in standard Board Mode
  return (
    <div className={`w-full h-fit flex flex-col gap-3 rounded-xl bg-[#F5F5F5] dark:bg-[#111111] border border-transparent dark:border-[#2A2A2A] p-3 ${className}`}>
      {/* Column Header */}
      <div className="w-full flex items-center justify-between py-1">
        {/* Left: Grip + Column Title */}
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 flex items-center justify-center text-[#737373] dark:text-[#A3A3A3]">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <span className="font-sans text-xs font-semibold text-[#171717] dark:text-[#F5F5F5] whitespace-nowrap">
            {title}
          </span>
        </div>
      </div>

      {/* Dynamic Task Container / Cards Stack */}
      <div className="flex flex-col gap-2.5">
        {children
          ? children
          : tasks.map((task) =>
            renderTaskCard ? (
              renderTaskCard(task)
            ) : (
              <TaskCard key={task.id} task={task} visibleFields={visibleFields} />
            )
          )}
      </div>

      {/* Bottom Add Task Button */}
      <button
        type="button"
        onClick={handleAddTask}
        className="w-full flex items-center gap-1.5 py-1.5 px-2 text-[#171717] dark:text-[#F5F5F5] hover:bg-[#E5E5E5]/60 dark:hover:bg-[#262626] rounded transition-colors cursor-pointer"
      >
        <Plus size={14} />
        <span className="font-sans text-xs font-medium leading-none">
          Add Task
        </span>
      </button>
    </div>
  );
}
