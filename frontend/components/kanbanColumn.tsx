"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Plus, SignalHigh, SignalMedium, SignalLow, MoreHorizontal, ChevronDown, Pencil, Trash2 } from "lucide-react";
import TaskCard from "./taskCard";
import { VisibleFields } from "./taskHeader";
import MemberAvatarStack from "./common/MemberAvatarStack";

export interface Task {
  id: string;
  title: string;
  assignee?: { name: string; avatar?: string } | string;
  members?: any[];
  dueDate?: string;
  priority?: string;
  status?: string;
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
  onUpdateTaskStatus?: (taskId: string, targetColumnId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
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
  onUpdateTaskStatus,
  onEditTask,
  onDeleteTask,
  renderTaskCard,
  className = "",
}: KanbanColumnProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuTaskId(null);
        setMenuPosition(null);
      }
    };
    const handleScroll = () => {
      setActiveMenuTaskId(null);
      setMenuPosition(null);
    };
    if (activeMenuTaskId) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [activeMenuTaskId]);

  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask(id);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("taskId");
    if (taskId && onUpdateTaskStatus) {
      onUpdateTaskStatus(taskId, id);
    }
  };

  // Render in List Accordion Mode matching Figma reference design
  if (isListMode) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full flex flex-col gap-2 ${className}`}
      >
        {/* Section Header: Lucide ChevronDown/Right + Section Title + Add Task button */}
        <div className="flex items-center justify-between py-1 select-none">
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[#171717] dark:text-[#F5F5F5] font-bold text-xs cursor-pointer group"
          >
            <svg
              className={`w-2.5 h-2.5 text-[#171717] dark:text-[#F5F5F5] fill-current transition-transform duration-200 ${
                isExpanded ? "rotate-0" : "-rotate-90"
              }`}
              viewBox="0 0 10 10"
            >
              <path d="M2 3.5L5 7.5L8 3.5H2Z" />
            </svg>
            <span>{title}</span>
          </div>

          <button
            type="button"
            onClick={handleAddTask}
            className="flex items-center gap-1 text-xs font-medium text-[#171717] dark:text-[#F5F5F5] hover:text-black dark:hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-[#F5F5F5] dark:hover:bg-[#262626] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>

        {/* List View Table Container (Drop Zone) */}
        {isExpanded && (
          <div
            className={`w-full overflow-x-auto border rounded-xl bg-white dark:bg-[#171717] shadow-xs transition-all ${isDragOver
              ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20"
              : "border-[#E5E5E5] dark:border-[#2A2A2A]"
              }`}
          >
            <div className="min-w-[36rem] flex flex-col">
              {/* Table Header Row */}
              <div
                onDragOver={handleDragOver}
                className="w-full h-11 flex items-center px-5 bg-[#F5F5F5] dark:bg-[#181818] border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-semibold text-[#404040] dark:text-[#D4D4D4]"
              >
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
              {tasks.length === 0 ? (
                <div
                  onDragOver={handleDragOver}
                  className="w-full py-6 px-5 text-xs text-[#737373] dark:text-[#A3A3A3] font-medium text-center border-b border-[#F0F0F0] dark:border-[#2A2A2A]"
                >
                  No tasks in {title.toLowerCase()}
                </div>
              ) : (
                tasks.map((task, index) => {
                  const assigneeName = typeof task.assignee === "string" ? task.assignee : task.assignee?.name || "";
                  const dueDate = task.dueDate || "";
                  const priority = task.priority || "Medium";

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragOver={handleDragOver}
                      className={`w-full h-12 flex items-center px-5 transition-colors text-xs text-[#171717] dark:text-[#F5F5F5] cursor-grab active:cursor-grabbing ${index !== tasks.length - 1 ? "border-b border-[#F0F0F0] dark:border-[#2A2A2A]" : ""
                        } hover:bg-[#FAFAFA] dark:hover:bg-[#202020]`}
                    >
                      {/* Drag Handle + Task Title */}
                      <div className="flex-1 min-w-[10rem] shrink-0 font-medium truncate pr-2 flex items-center gap-2">
                        <Link
                          href={`/task?id=${task.id}&title=${encodeURIComponent(task.title || "")}`}
                          draggable={false}
                          className="hover:underline cursor-pointer truncate text-[#171717] dark:text-[#F5F5F5]"
                        >
                          {task.title}
                        </Link>
                      </div>

                      {/* Remaining Columns */}
                      <div className="flex-1 min-w-[18rem] grid grid-cols-4 items-center gap-2">
                        {/* Priority */}
                        <div className="flex items-center gap-1.5 min-w-0">
                          {priority.toLowerCase() === "low" ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                              <SignalLow size={12} className="text-slate-500 dark:text-slate-400 shrink-0 stroke-[2.5]" />
                              Low
                            </span>
                          ) : priority.toLowerCase() === "medium" ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-orange-500 dark:text-orange-400 truncate">
                              <SignalMedium size={12} className="text-orange-500 dark:text-orange-400 shrink-0 stroke-[2.5]" />
                              Medium
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-medium text-red-500 dark:text-red-400 truncate">
                              <SignalHigh size={12} className="text-red-500 dark:text-red-400 shrink-0 stroke-[2.5]" />
                              High
                            </span>
                          )}
                        </div>

                        {/* Members */}
                        <div className="flex items-center gap-1.5 min-w-0">
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
                        </div>

                        {/* Due Date */}
                        <div className="text-xs text-[#404040] dark:text-[#D4D4D4] flex items-center min-w-0 truncate">
                          {dueDate}
                        </div>

                        {/* Actions — only shown when edit/delete handlers are available */}
                        <div className="flex items-center justify-end shrink-0">
                          {(onEditTask || onDeleteTask) && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (activeMenuTaskId === task.id) {
                                    setActiveMenuTaskId(null);
                                    setMenuPosition(null);
                                  } else {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setActiveMenuTaskId(task.id);
                                    setMenuPosition({
                                      top: rect.bottom + 4,
                                      left: rect.right - 128,
                                    });
                                  }
                                }}
                                className="text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-[#F5F5F5] transition-colors p-1 cursor-pointer"
                                title="Actions"
                              >
                                <MoreHorizontal className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
                              </button>

                              {activeMenuTaskId === task.id && menuPosition && typeof window !== "undefined" && createPortal(
                                <div
                                  ref={menuRef}
                                  style={{
                                    position: "fixed",
                                    top: `${menuPosition.top}px`,
                                    left: `${menuPosition.left}px`,
                                  }}
                                  className="w-32 bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg shadow-2xl z-[99999] p-1 flex flex-col animate-in fade-in zoom-in-95 duration-100"
                                >
                                  {onEditTask && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEditTask(task);
                                        setActiveMenuTaskId(null);
                                        setMenuPosition(null);
                                      }}
                                      className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#171717] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded transition-colors w-full text-left cursor-pointer font-medium"
                                    >
                                      <Pencil size={12} />
                                      <span>Edit</span>
                                    </button>
                                  )}
                                  {onDeleteTask && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteTask(task.id);
                                        setActiveMenuTaskId(null);
                                        setMenuPosition(null);
                                      }}
                                      className="flex items-center gap-2 px-2 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded transition-colors w-full text-left cursor-pointer font-medium"
                                    >
                                      <Trash2 size={12} />
                                      <span>Delete</span>
                                    </button>
                                  )}
                                </div>,
                                document.body
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Bottom Add Task Row */}
              <div
                onDragOver={handleDragOver}
                className="w-full h-11 flex items-center px-5 bg-white dark:bg-[#171717] rounded-b-xl border-t border-[#F0F0F0] dark:border-[#2A2A2A]"
              >
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#171717] dark:text-[#F5F5F5] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Plus size={14} className="stroke-[2.5]" />
                  <span>Add Task</span>
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
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full h-fit flex flex-col gap-3 rounded-xl bg-[#F5F5F5] dark:bg-[#111111] border transition-all p-3 ${isDragOver
        ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20"
        : "border-transparent dark:border-[#2A2A2A]"
        } ${className}`}
    >
      {/* Column Header */}
      <div className="w-full flex items-center justify-between py-1">
        {/* Left: Column Title */}
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-semibold text-[#171717] dark:text-[#F5F5F5] whitespace-nowrap">
            {title}
          </span>
        </div>
      </div>

      {/* Dynamic Task Container / Cards Stack */}
      <div
        onDragOver={handleDragOver}
        className="flex flex-col gap-2.5 min-h-[60px]"
      >
        {children
          ? children
          : tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              className="cursor-grab active:cursor-grabbing"
            >
              {renderTaskCard ? (
                renderTaskCard(task)
              ) : (
                <TaskCard task={task} visibleFields={visibleFields} />
              )}
            </div>
          ))}
      </div>

      {/* Bottom Add Task Button */}
      <button
        type="button"
        onClick={handleAddTask}
        className="w-full flex items-center gap-1.5 py-1.5 px-2 text-[#171717] dark:text-[#F5F5F5] hover:bg-[#E5E5E5]/60 dark:hover:bg-[#262626] rounded transition-colors cursor-pointer"
      >
        <Plus size={14} className="stroke-[2.5]" />
        <span className="font-sans text-xs font-medium leading-none">
          Add Task
        </span>
      </button>
    </div>
  );
}
