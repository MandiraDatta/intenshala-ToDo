"use client";

import React from "react";
import { GripVertical, Plus, MoreHorizontal } from "lucide-react";
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
}: KanbanColumnProps) {
  // Shared handler triggered by both the header '+' button and the bottom 'Add Task' button
  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask(id);
    }
  };

  return (
    <div className={`w-full h-fit flex flex-col gap-3 rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] p-3 ${className}`}>
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

        {/* Right: + Add task & ... Filter icons */}
        <div className="flex items-center gap-2 text-[#737373]">
          <button
            type="button"
            onClick={handleAddTask}
            className="p-1 hover:text-[#171717] transition-colors cursor-pointer"
            aria-label="Add Task"
          >
            <Plus size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMoreOptions?.(id)}
            className="p-1 hover:text-[#171717] transition-colors cursor-pointer"
            aria-label="More options"
          >
            <MoreHorizontal size={14} />
          </button>
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
