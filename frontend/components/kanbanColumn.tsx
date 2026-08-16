"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GripVertical, Plus, ChevronDown, ChevronRight, SignalLow, SignalMedium, SignalHigh } from "lucide-react";
import { RiMoreFill } from "@remixicon/react";
import TaskCard from "./taskCard";
import { VisibleFields } from "./taskHeader";

export interface Task {
  id: string | number;
  title: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  tags?: string[];
  priority?: string;
  [key: string]: any;
}

export interface KanbanColumnProps {
  id?: string;
  title: string;
  tasks?: Task[];
  visibleFields?: VisibleFields;
  onAddTask?: (columnId?: string) => void;
  onMoreOptions?: (columnId?: string) => void;
  renderTaskCard?: (task: Task) => React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  isListMode?: boolean;
}

export default function KanbanColumn({
  id,
  title,
  tasks = [],
  visibleFields,
  onAddTask,
  onMoreOptions,
  renderTaskCard,
  children,
  className = "",
  isListMode = false,
}: KanbanColumnProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Shared handler triggered by '+' buttons
  const handleAddTask = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onAddTask) {
      onAddTask(id);
    }
  };

  // Render in Figma Table / List Mode
  if (isListMode) {
    return (
      <div className={`w-full flex flex-col ${className}`}>
        {/* Figma Accordion Header Row */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-1 py-2 gap-4 cursor-pointer hover:bg-[#F9F9F9] rounded-md transition-colors select-none mb-1"
        >
          <div className="flex items-center gap-2">
            <button type="button" className="text-[#171717] p-0.5">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <span className="font-sans text-xs font-semibold text-[#171717]">
              {title}
            </span>
          </div>
        </div>

        {/* Collapsible Dropdown Table */}
        {isOpen && (
          <div className="w-full overflow-x-auto border border-[#E5E5E5] rounded-md bg-white">
            <div className="min-w-[36rem] flex flex-col">
              {/* Table Header Row */}
              <div className="w-full h-11 flex items-center px-4 bg-[#F9F9F9] border-b border-[#E5E5E5] text-[11px] font-medium text-[#737373]">
                <div className="flex-1 min-w-[10rem] max-w-[30.8125rem] text-[#171717] shrink-0 flex items-center pr-2">Task</div>
                <div className="flex-1 min-w-[18rem] grid grid-cols-4 text-[#171717] items-center gap-2">
                  <div className="flex items-center min-w-0">Priority</div>
                  <div className="flex items-center min-w-0">Members</div>
                  <div className="flex items-center min-w-0">Due Date</div>
                  <div className="flex items-center justify-end">Actions</div>
                </div>
              </div>

              {/* Table Task Rows */}
              {tasks.map((task) => {
                const assigneeName = task.assignee?.name || "Admin";
                const dueDate = task.dueDate || "29 Jul";
                const priority = task.priority || "High";

                return (
                  <div
                    key={task.id}
                    className="w-full h-11 flex items-center px-4 border-b border-[#F0F0F0] hover:bg-[#F9F9F9] transition-colors text-xs text-[#171717]"
                  >
                    {/* Task Title */}
                    <div className="flex-1 min-w-[10rem] max-w-[30.8125rem] shrink-0 font-medium truncate pr-2 flex items-center">
                      <Link href="/task" className="hover:underline cursor-pointer truncate">
                        {task.title}
                      </Link>
                    </div>

                    {/* Remaining Columns */}
                    <div className="flex-1 min-w-[18rem] grid grid-cols-4 items-center gap-2">
                      {/* Priority */}
                      <div className="flex items-center gap-1 min-w-0">
                        {priority.toLowerCase() === "low" ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-[#94A3B8] truncate">
                            <SignalLow size={12} className="text-[#94A3B8] shrink-0" />
                            Low
                          </span>
                        ) : priority.toLowerCase() === "medium" ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-[#F97316] truncate">
                            <SignalMedium size={12} className="text-[#F97316] shrink-0" />
                            Medium
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-[#EF4444] truncate">
                            <SignalHigh size={12} className="text-[#EF4444] shrink-0" />
                            High
                          </span>
                        )}
                      </div>

                      {/* Members */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                          {assigneeName.charAt(0)}
                        </div>
                        <span className="text-[11px] text-[#404040] truncate">
                          {assigneeName}
                        </span>
                      </div>

                      {/* Due Date */}
                      <div className="text-[11px] text-[#525252] flex items-center min-w-0 truncate">
                        {dueDate}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end shrink-0">
                        <button
                          type="button"
                          onClick={() => onMoreOptions?.(id)}
                          className="text-[#171717] hover:text-black transition-colors p-1 cursor-pointer"
                        >
                          <RiMoreFill className="w-4 h-4 text-[#171717]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Add Task Row */}
              <div className="px-4 py-2 bg-white">
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="flex items-center gap-1.5 text-xs text-[#171717] hover:text-[#171717] transition-colors py-1 cursor-pointer font-medium"
                >
                  <Plus size={14} />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render in standard Board Mode
  return (
    <div className={`w-full h-fit flex flex-col gap-3 rounded-xl bg-[#F5F5F5] p-3 ${className}`}>
      {/* Column Header */}
      <div className="w-full flex items-center justify-between py-1">
        {/* Left: Grip + Column Title */}
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 flex items-center justify-center text-[#737373]">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <span className="font-sans text-xs font-semibold text-[#171717] whitespace-nowrap">
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
        className="w-full flex items-center gap-1.5 py-1.5 px-2 text-[#171717] hover:bg-[#E5E5E5]/60 rounded transition-colors cursor-pointer"
      >
        <Plus size={14} />
        <span className="font-sans text-xs font-medium leading-none">
          Add Task
        </span>
      </button>
    </div>
  );
}
