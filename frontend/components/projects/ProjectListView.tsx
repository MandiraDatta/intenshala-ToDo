"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  Pencil,
  Check,
  X,
  UserPlus,
} from "lucide-react";
import { Project, VisibleFields } from "./types";
import MemberAvatarStack from "@/components/common/MemberAvatarStack";
import InviteModal from "@/components/common/InviteModal";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useTheme } from "@/context/ThemeContext";
import { inviteService } from "@/services/invite.service";

interface ProjectListViewProps {
  projects: Project[];
  visibleFields: VisibleFields;
  onAddProject: () => void;
  onDeleteProject?: (id: string) => void;
  onEditProject?: (project: Project) => void;
  onUpdateProject?: (updatedProject: Project) => void;
}

function LeadSelectorCell({
  project,
  onUpdateProject,
}: {
  project: Project;
  onUpdateProject?: (updatedProject: Project) => void;
}) {
  const { activeWorkspace } = useWorkspace();
  const { currentColorHex } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadMembers = async () => {
    if (!activeWorkspace?.id) return;
    try {
      const data = await inviteService.getWorkspaceMembers(activeWorkspace.id);
      setWorkspaceMembers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    loadMembers();
    setIsOpen((prev) => !prev);
  };

  const handleSelectLead = (member: any) => {
    const leadName = member.fullName || member.username || member.email || "Member";
    const leadMember = {
      id: member.id || member.userId || `m-${Date.now()}`,
      name: leadName,
      initials: leadName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase(),
      avatar: member.avatarUrl,
    };

    const updatedMembers = [...project.members];
    if (!updatedMembers.some((m) => m.name.toLowerCase() === leadName.toLowerCase())) {
      updatedMembers.unshift(leadMember);
    }

    const updatedProject: Project = {
      ...project,
      reporter: leadName,
      members: updatedMembers,
    };

    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }
    setIsOpen(false);
  };

  const hasLead = Boolean(project.reporter && project.reporter.trim());
  const leadMember = hasLead
    ? project.members.find((m) => m.name.toLowerCase() === project.reporter.trim().toLowerCase()) || {
        id: `lead-${project.reporter}`,
        name: project.reporter,
        initials: project.reporter
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      }
    : null;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {hasLead && leadMember ? (
        <div
          onClick={handleOpen}
          className="flex items-center group cursor-pointer"
          title={`Lead: ${leadMember.name} (Click to change)`}
        >
          <MemberAvatarStack members={[leadMember]} showPlusButton={false} />
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="w-6 h-6 rounded-full border border-dashed border-[#A3A3A3] dark:border-[#525252] hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-[#171717] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[#737373] dark:text-[#A3A3A3] hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          title="Add Lead"
        >
          <Plus size={12} className="stroke-[2.5]" />
        </button>
      )}

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg shadow-xl z-50 p-1 w-48 max-h-48 overflow-y-auto flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 border-b border-[#F0F0F0] dark:border-[#262626] mb-1">
            <span className="text-[10px] font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
              Select Lead
            </span>
          </div>

          {workspaceMembers.length === 0 ? (
            <div className="p-2 text-center text-xs text-[#737373] dark:text-[#A3A3A3]">
              No members found.
            </div>
          ) : (
            workspaceMembers.map((m) => {
              const memberName = m.fullName || m.username || m.email || "Member";
              const isSelected = project.reporter?.toLowerCase() === memberName.toLowerCase();

              return (
                <button
                  key={m.id || m.userId}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectLead(m);
                  }}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors text-left cursor-pointer ${
                    isSelected
                      ? "bg-neutral-100 dark:bg-neutral-800 font-medium"
                      : "hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
                  }`}
                  style={isSelected ? { backgroundColor: `${currentColorHex}1A`, color: currentColorHex } : {}}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div
                      className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: currentColorHex }}
                    >
                      {(m.fullName || m.username || "M")[0].toUpperCase()}
                    </div>
                    <span className="truncate">{memberName}</span>
                  </div>
                  {isSelected && <Check size={12} className="shrink-0" style={{ color: currentColorHex }} />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function ProjectMembersModal({
  project,
  onClose,
  onUpdateProject,
}: {
  project: Project;
  onClose: () => void;
  onUpdateProject?: (updatedProject: Project) => void;
}) {
  const { activeWorkspace } = useWorkspace();
  const { currentColorHex } = useTheme();
  const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    inviteService
      .getWorkspaceMembers(activeWorkspace.id)
      .then((data) => {
        setWorkspaceMembers(Array.isArray(data) ? data : []);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [activeWorkspace?.id]);

  const handleAddMember = (m: any) => {
    const memberName = m.fullName || m.username || m.email || "Member";
    const alreadyExists = project.members.some(
      (mem) => mem.name.toLowerCase() === memberName.toLowerCase()
    );

    if (!alreadyExists) {
      const newMemberItem = {
        id: m.user?.id || m.userId || m.id || `m-${Date.now()}`,
        userId: m.user?.id || m.userId || m.id,
        name: memberName,
        email: m.user?.email || m.email,
        initials: memberName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase(),
        avatar: m.user?.avatarUrl || m.avatarUrl,
      };

      const updatedProject: Project = {
        ...project,
        members: [...project.members, newMemberItem],
      };

      if (onUpdateProject) onUpdateProject(updatedProject);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    const updatedProject: Project = {
      ...project,
      members: project.members.filter((mem) => mem.id !== memberId),
    };
    if (onUpdateProject) onUpdateProject(updatedProject);
  };

  const filteredWorkspaceMembers = workspaceMembers.filter((m) => {
    const name = (m.fullName || m.username || m.email || "").toLowerCase();
    return name.includes(searchQuery.toLowerCase().trim());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: currentColorHex }} />
            <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F5F5F5]">
              Project Members - {project.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded text-[#737373] dark:text-[#A3A3A3] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {/* Current Project Members List */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
              Current Members ({project.members.length})
            </span>
            {project.members.length === 0 ? (
              <div className="p-3 text-center text-xs text-[#737373] dark:text-[#A3A3A3] bg-[#FAFAFA] dark:bg-[#202020] rounded-lg">
                No members added yet.
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {project.members.map((mem) => (
                  <div
                    key={mem.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#202020] border border-[#F0F0F0] dark:border-[#2A2A2A]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs"
                        style={{ backgroundColor: currentColorHex }}
                      >
                        {mem.avatar ? (
                          <Image
                            src={mem.avatar}
                            alt={mem.name}
                            width={28}
                            height={28}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          mem.initials || mem.name[0].toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5] truncate">
                          {mem.name}
                        </span>
                        {mem.email && (
                          <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3] leading-none mt-0.5 truncate">
                            {mem.email}
                          </span>
                        )}
                        {mem.source === 'task' && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 leading-none mt-0.5">
                            via task
                          </span>
                        )}
                      </div>
                    </div>

                    {mem.source === 'task' ? (
                      <span
                        title="This member is assigned via a task. Edit the task to remove them."
                        className="text-[10px] font-medium text-[#A3A3A3] dark:text-[#737373] px-1.5 py-0.5 bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-md shrink-0"
                      >
                        read-only
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(mem.id)}
                        className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[#737373] dark:text-[#A3A3A3] hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors cursor-pointer shrink-0"
                        title="Remove member"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Existing Workspace Members */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
              Add Member from Workspace
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspace members..."
              className="w-full px-3 py-1.5 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] rounded-md outline-none"
            />

            <div className="max-h-40 overflow-y-auto flex flex-col gap-1 pr-1">
              {loading ? (
                <div className="p-3 text-center text-xs text-[#737373] dark:text-[#A3A3A3]">
                  Loading workspace members...
                </div>
              ) : filteredWorkspaceMembers.length === 0 ? (
                <div className="p-3 text-center text-xs text-[#737373] dark:text-[#A3A3A3]">
                  No workspace members found.
                </div>
              ) : (
                filteredWorkspaceMembers.map((m) => {
                  const name = m.fullName || m.username || m.email || "Member";
                  const isAdded = project.members.some(
                    (mem) => mem.name.toLowerCase() === name.toLowerCase()
                  );

                  return (
                    <div
                      key={m.id || m.userId}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div
                          className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0"
                          style={{ backgroundColor: currentColorHex }}
                        >
                          {(m.fullName || m.username || "M")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5] truncate">
                            {name}
                          </span>
                          {m.email && (
                            <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3] leading-none truncate">
                              {m.email}
                            </span>
                          )}
                        </div>
                      </div>

                      {isAdded ? (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check size={12} /> Added
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddMember(m)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white rounded-md transition-colors cursor-pointer"
                          style={{ backgroundColor: currentColorHex }}
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer with Invite Link */}
        <div className="p-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#111111] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold hover:underline cursor-pointer"
            style={{ color: currentColorHex }}
          >
            <UserPlus size={13} />
            <span>+ Invite New Member</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold bg-[#E5E5E5] dark:bg-[#333333] hover:bg-[#D4D4D4] dark:hover:bg-[#404040] text-[#171717] dark:text-[#F5F5F5] rounded-md transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {isInviteModalOpen && (
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          projectId={project.id}
        />
      )}
    </div>
  );
}

export default function ProjectListView({
  projects,
  visibleFields,
  onAddProject,
  onDeleteProject,
  onEditProject,
  onUpdateProject,
}: ProjectListViewProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [membersModalProject, setMembersModalProject] = useState<Project | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
        setMenuPosition(null);
      }
    };
    const handleScroll = () => {
      setActiveMenuId(null);
      setMenuPosition(null);
    };
    if (activeMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [activeMenuId]);

  const renderPriority = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 dark:text-red-400">
            <SignalHigh size={12} className="stroke-[2.5]" />
            <span>Urgent</span>
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 dark:text-red-400">
            <SignalHigh size={12} className="stroke-[2.5]" />
            <span>High</span>
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-500 dark:text-orange-400">
            <SignalMedium size={12} className="stroke-[2.5]" />
            <span>Medium</span>
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <SignalLow size={12} className="stroke-[2.5]" />
            <span>Low</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400">
            <Signal size={12} className="stroke-[2.5]" />
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
              <th className="px-4 py-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F0] dark:divide-[#262626]">
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
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
                        href={`/dashboard?projectId=${project.id}`}
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

                  {/* Lead Column (ONLY 1 Lead Avatar or + Button) */}
                  {visibleFields.members && (
                    <td className="px-4 py-2">
                      <LeadSelectorCell project={project} onUpdateProject={onUpdateProject} />
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

                  {/* Actions — button always visible; Edit/Delete only for OWNER/ADMIN */}
                  <td className="px-4 py-2 text-right relative">
                    <div className="inline-block">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeMenuId === project.id) {
                            setActiveMenuId(null);
                            setMenuPosition(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setActiveMenuId(project.id);
                            setMenuPosition({
                              top: rect.bottom + 4,
                              left: rect.right - 144,
                            });
                          }
                        }}
                        className="p-1 hover:bg-[#E5E5E5] dark:hover:bg-[#333333] rounded text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
                        title="Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === project.id && menuPosition && typeof window !== "undefined" && createPortal(
                        <div
                          ref={menuRef}
                          style={{
                            position: "fixed",
                            top: `${menuPosition.top}px`,
                            left: `${menuPosition.left}px`,
                          }}
                          className="w-36 bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg shadow-2xl z-[99999] p-1 flex flex-col animate-in fade-in zoom-in-95 duration-100"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setMembersModalProject(project);
                              setActiveMenuId(null);
                              setMenuPosition(null);
                            }}
                            className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#171717] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded transition-colors w-full text-left cursor-pointer font-medium"
                          >
                            <Users size={12} />
                            <span>Members</span>
                          </button>
                          {onEditProject && (
                            <button
                              type="button"
                              onClick={() => {
                                onEditProject(project);
                                setActiveMenuId(null);
                                setMenuPosition(null);
                              }}
                              className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#171717] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded transition-colors w-full text-left cursor-pointer font-medium"
                            >
                              <Pencil size={12} />
                              <span>Edit</span>
                            </button>
                          )}
                          {onDeleteProject && (
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteProject(project.id);
                                setActiveMenuId(null);
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Project Row — only shown for OWNER/ADMIN */}
      {onAddProject && (
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
      )}

      {/* Project Members Modal */}
      {membersModalProject && (
        <ProjectMembersModal
          project={membersModalProject}
          onClose={() => setMembersModalProject(null)}
          onUpdateProject={(updated) => {
            setMembersModalProject(updated);
            if (onUpdateProject) onUpdateProject(updated);
          }}
        />
      )}
    </div>
  );
}
