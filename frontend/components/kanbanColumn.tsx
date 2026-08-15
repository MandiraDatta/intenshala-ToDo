"use client";

import React from "react";
import { GripVertical, Plus, MoreHorizontal } from "lucide-react";

export interface Task {
  id: string | number;
  title: string;
  [key: string]: any;
}

export interface KanbanColumnProps {
  id?: string;
  title: string;
  tasks?: Task[];
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
    <div className={`w-full flex flex-col gap-5 rounded-lg border border-[#E5E5E5] ${className}`}>
      {/* header */}
      <div className="w-full h-[39px] flex justify-between p-3">
        {/* left */}
        <div className="w-full h-3.5 flex items-center gap-2">
          {/* Grip */}
          <div className="w-3.5 h-3.5 flex items-center justify-center">
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Title */}
          <div className="w-[34px] h-3 flex items-center">
            <span className="font-sans text-xs font-semibold leading-3 text-[#171717] whitespace-nowrap">
              {title}
            </span>
          </div>

          {/* right  */}
          <div className="w-9 h-3.5 flex items-center ml-auto gap-2">
            {/* add task (Header + button) */}
            <div
              onClick={handleAddTask}
              className="w-3.5 h-3.5 flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-[61rem] h-[49.25rem] gap-5" />
            </div>
            {/* filter */}
            <div
              onClick={() => onMoreOptions?.(id)}
              className="w-5 h-3.5 ml-auto flex items-center justify-center cursor-pointer"
            >
              <span className="font-sans text-xs font-semibold leading-3 text-[#171717] whitespace-nowrap flex items-center justify-center">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task row (Bottom button) */}
      <div className="w-full h-[39px] flex justify-between px-3">
        <div
          onClick={handleAddTask}
          className="w-[5.625rem] h-6 flex items-center gap-1 py-2 px-[0.625rem] text-[#171717] cursor-pointer"
        >
          <div className="w-3.5 h-3.5 flex items-center justify-center">
            <Plus size={14} />
          </div>

          <div className="w-[3.375rem] h-4 flex items-center">
            <span className="font-sans text-xs font-medium leading-4 tracking-normal whitespace-nowrap">
              Add Task
            </span>
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      {(children || tasks.length > 0) && (
        <div className="flex flex-col gap-3 px-3 pb-3">
          {children
            ? children
            : tasks.map((task) =>
                renderTaskCard ? (
                  renderTaskCard(task)
                ) : (
                  <div
                    key={task.id}
                    className="p-3 bg-white rounded-lg border border-[#E5E5E5] shadow-sm flex flex-col gap-2"
                  >
                    <span className="text-xs font-medium text-[#171717]">
                      {task.title}
                    </span>
                  </div>
                )
              )}
        </div>
      )}
    </div>
  );
}
