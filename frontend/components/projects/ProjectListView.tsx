"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SignalHigh,
  SignalMedium,
  SignalLow,
  Signal,
  MoreHorizontal,
  Plus,
  Circle,
  Tag,
  Users,
  User,
  Calendar,
  Trash2,
} from "lucide-react";
import { Project, VisibleFields } from "./types";
import { useState } from "react";

interface ProjectListViewProps {
  projects: Project[];
  visibleFields: VisibleFields;
  onAddProject: () => void;
  onDeleteProject?: (id: string) => void;
}

export default function ProjectListView({
  projects,
  visibleFields,
  onAddProject,
  onDeleteProject,
}: ProjectListViewProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const renderPriority = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <SignalHigh size={13} className="stroke-[2.5]" />
            <span>Urgent</span>
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <SignalHigh size={13} className="stroke-[2.5]" />
            <span>High</span>
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
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

  const renderStatus = (status: string) => {
    switch (status) {
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300">
            <Circle className="w-2 h-2 fill-amber-500 text-amber-500" />
            <span>In Progress</span>
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300">
            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
            <span>Completed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300">
            <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
            <span>Planned</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#171717] overflow-hidden shadow-2xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="h-10 bg-[#FAFAFA] dark:bg-[#111111] border-b border-[#E5E5E5] dark:border-[#2A2A2A] font-semibold text-[#737373] dark:text-[#A3A3A3]">
              {visibleFields.project && <th className="px-4 py-2 font-semibold">Projects</th>}
              {visibleFields.priority && <th className="px-4 py-2 font-semibold">Priority</th>}
              {visibleFields.members && <th className="px-4 py-2 font-semibold">Lead</th>}
              {visibleFields.dueDate && <th className="px-4 py-2 font-semibold">Due Date</th>}
              {visibleFields.status && <th className="px-4 py-2 font-semibold">Status</th>}
              {visibleFields.teams && <th className="px-4 py-2 font-semibold">Teams</th>}
              {visibleFields.labels && <th className="px-4 py-2 font-semibold">Labels</th>}
              {visibleFields.reporter && <th className="px-4 py-2 font-semibold">Reporter</th>}
              <th className="px-4 py-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F0] dark:divide-[#262626]">
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-[#737373] dark:text-[#A3A3A3] font-medium"
                >
                  No projects found matching the criteria.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="h-11 hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors text-[#171717] dark:text-[#F5F5F5]"
                >
                  {/* Project Name */}
                  {visibleFields.project && (
                    <td className="px-4 py-2 font-semibold text-[#171717] dark:text-[#F5F5F5]">
                      <Link
                        href={`/task?projectId=${project.id}`}
                        className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {project.name}
                      </Link>
                    </td>
                  )}

                  {/* Priority */}
                  {visibleFields.priority && (
                    <td className="px-4 py-2">{renderPriority(project.priority)}</td>
                  )}

                  {/* Members */}
                  {visibleFields.members && (
                    <td className="px-4 py-2">
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
                    </td>
                  )}

                  {/* Due Date */}
                  {visibleFields.dueDate && (
                    <td className="px-4 py-2 text-[#737373] dark:text-[#A3A3A3] font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#737373] dark:text-[#A3A3A3]" />
                        <span>{project.dueDate}</span>
                      </div>
                    </td>
                  )}

                  {/* Status */}
                  {visibleFields.status && (
                    <td className="px-4 py-2">{renderStatus(project.status)}</td>
                  )}

                  {/* Teams */}
                  {visibleFields.teams && (
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1 flex-wrap">
                        {project.teams.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F5F5F5] dark:bg-[#262626] text-[11px] font-medium text-[#737373] dark:text-[#A3A3A3]"
                          >
                            <Users size={10} />
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}

                  {/* Labels */}
                  {visibleFields.labels && (
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1 flex-wrap">
                        {project.labels.map((l) => (
                          <span
                            key={l}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-medium text-[#171717] dark:text-[#F5F5F5]"
                          >
                            <Tag size={10} className="text-[#737373] dark:text-[#A3A3A3]" />
                            {l}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}

                  {/* Reporter */}
                  {visibleFields.reporter && (
                    <td className="px-4 py-2 text-[#737373] dark:text-[#A3A3A3] font-medium">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{project.reporter}</span>
                      </div>
                    </td>
                  )}

                  {/* Actions */}
                  <td className="px-4 py-2 text-right relative">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === project.id ? null : project.id)
                        }
                        className="p-1 hover:bg-[#E5E5E5] dark:hover:bg-[#333333] rounded text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
                        title="Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === project.id && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg shadow-xl z-50 p-1 flex flex-col">
                          <button
                            type="button"
                            onClick={() => {
                              if (onDeleteProject) onDeleteProject(project.id);
                              setActiveMenuId(null);
                            }}
                            className="flex items-center gap-2 px-2 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded transition-colors w-full text-left cursor-pointer font-medium"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Project Row at the bottom of the table */}
      <div className="p-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#111111]">
        <button
          type="button"
          onClick={onAddProject}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#171717] dark:text-[#F5F5F5] hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Project</span>
        </button>
      </div>
    </div>
  );
}
