"use client";

import { Plus, Circle } from "lucide-react";
import { Project, StatusType, VisibleFields } from "./types";
import ProjectCard from "./ProjectCard";

interface ProjectBoardViewProps {
  projects: Project[];
  visibleFields: VisibleFields;
  onAddProject: (defaultStatus?: StatusType) => void;
  onDeleteProject?: (id: string) => void;
  onUpdateStatus?: (id: string, newStatus: StatusType) => void;
}

export default function ProjectBoardView({
  projects,
  visibleFields,
  onAddProject,
  onDeleteProject,
  onUpdateStatus,
}: ProjectBoardViewProps) {
  const columns: { id: StatusType; title: string; color: string }[] = [
    { id: "Planned", title: "Planned", color: "fill-blue-500 text-blue-500" },
    { id: "In Progress", title: "In Progress", color: "fill-amber-500 text-amber-500" },
    { id: "Completed", title: "Completed", color: "fill-emerald-500 text-emerald-500" },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: StatusType) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("projectId");
    if (projectId && onUpdateStatus) {
      onUpdateStatus(projectId, targetStatus);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {columns.map((col) => {
        const columnProjects = projects.filter((p) => p.status === col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex flex-col bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-3 gap-3 min-h-[320px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1 py-0.5">
              <div className="flex items-center gap-2">
                <Circle className={`w-2.5 h-2.5 ${col.color}`} />
                <h2 className="font-semibold text-xs text-[#171717] dark:text-[#F5F5F5]">
                  {col.title}
                </h2>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5E5E5] dark:bg-[#262626] text-[#737373] dark:text-[#A3A3A3]">
                  {columnProjects.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onAddProject(col.id)}
                className="p-1 hover:bg-[#E5E5E5] dark:hover:bg-[#262626] rounded text-[#737373] hover:text-[#171717] dark:text-[#A3A3A3] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
                title={`Add project to ${col.title}`}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Column Project Cards List */}
            <div className="flex flex-col gap-3 min-h-[120px]">
              {columnProjects.length === 0 ? (
                <div className="h-24 border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg flex items-center justify-center text-xs text-[#A3A3A3] dark:text-[#737373] font-medium">
                  No projects
                </div>
              ) : (
                columnProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    visibleFields={visibleFields}
                    onDeleteProject={onDeleteProject}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))
              )}
            </div>

            {/* Column Footer: Add Project Button */}
            <button
              type="button"
              onClick={() => onAddProject(col.id)}
              className="w-full py-2 px-3 border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg text-xs font-semibold text-[#737373] hover:text-[#171717] dark:text-[#A3A3A3] dark:hover:text-[#F5F5F5] hover:bg-white dark:hover:bg-[#171717] transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
            >
              <Plus size={14} />
              <span>Add Project</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
