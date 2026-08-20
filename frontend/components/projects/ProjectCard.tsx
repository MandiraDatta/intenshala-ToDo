"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  SignalHigh,
  SignalMedium,
  SignalLow,
  Signal,
  MoreHorizontal,
  Calendar,
  Tag,
  Users,
  Trash2,
} from "lucide-react";
import { Project, VisibleFields, StatusType } from "./types";

interface ProjectCardProps {
  project: Project;
  visibleFields: VisibleFields;
  onDeleteProject?: (id: string) => void;
  onUpdateStatus?: (id: string, newStatus: StatusType) => void;
}

export default function ProjectCard({
  project,
  visibleFields,
  onDeleteProject,
}: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderPriority = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
            <SignalHigh size={13} className="stroke-[2.5]" />
            <span>Urgent</span>
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
            <SignalHigh size={13} className="stroke-[2.5]" />
            <span>High</span>
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <SignalMedium size={13} className="stroke-[2.5]" />
            <span>Medium</span>
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            <SignalLow size={13} className="stroke-[2.5]" />
            <span>Low</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400">
            <Signal size={13} className="stroke-[2.5]" />
            <span>No Priority</span>
          </span>
        );
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", project.id);
    e.dataTransfer.setData("projectId", project.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="w-full bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-3.5 flex flex-col gap-3 shadow-2xs hover:shadow-md transition-shadow relative cursor-grab active:cursor-grabbing"
    >
      {/* Header: Project Name & Actions Menu */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-xs text-[#171717] dark:text-[#F5F5F5] leading-snug">
          <Link
            href={`/task?projectId=${project.id}`}
            className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {project.name}
          </Link>
        </h3>
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-[#737373] hover:text-[#171717] dark:text-[#A3A3A3] dark:hover:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded transition-colors cursor-pointer"
            title="More Options"
          >
            <MoreHorizontal size={14} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg shadow-xl z-50 p-1 flex flex-col">
              <button
                type="button"
                onClick={() => {
                  if (onDeleteProject) onDeleteProject(project.id);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded transition-colors w-full text-left cursor-pointer font-medium"
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Priority Row */}
      {visibleFields.priority && (
        <div className="flex items-center gap-2">
          {renderPriority(project.priority)}
        </div>
      )}

      {/* Members & Due Date Row */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#F0F0F0] dark:border-[#262626]">
        {/* Members */}
        {visibleFields.members && (
          <div className="flex items-center -space-x-1.5">
            {project.members.map((member, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-[#171717] overflow-hidden bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0"
                title={member.name}
              >
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  member.initials || member.name[0]
                )}
              </div>
            ))}
          </div>
        )}

        {/* Due Date */}
        {visibleFields.dueDate && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#737373] dark:text-[#A3A3A3] ml-auto">
            <Calendar size={11} />
            <span>Due: {project.dueDate}</span>
          </div>
        )}
      </div>

      {/* Teams & Labels Row */}
      {((visibleFields.teams && project.teams.length > 0) ||
        (visibleFields.labels && project.labels.length > 0)) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {visibleFields.teams &&
              project.teams.map((team) => (
                <span
                  key={team}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F5F5F5] dark:bg-[#262626] text-[10px] font-medium text-[#737373] dark:text-[#A3A3A3]"
                >
                  <Users size={10} />
                  {team}
                </span>
              ))}
            {visibleFields.labels &&
              project.labels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[10px] font-medium text-[#171717] dark:text-[#F5F5F5]"
                >
                  <Tag size={10} className="text-[#737373] dark:text-[#A3A3A3]" />
                  {label}
                </span>
              ))}
          </div>
        )}
    </div>
  );
}
