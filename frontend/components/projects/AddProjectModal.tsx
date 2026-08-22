"use client";

import { useState, useEffect, useRef } from "react";
import { X, UserPlus, Check } from "lucide-react";
import { Project, PriorityType, StatusType } from "./types";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useTheme } from "@/context/ThemeContext";
import { inviteService } from "@/services/invite.service";
import InviteModal from "@/components/common/InviteModal";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProject: Project) => void;
  initialStatus?: StatusType;
  initialProject?: Project | null;
}

function toInputDateString(dateStr?: string): string {
  if (!dateStr || dateStr === "No Due Date") return "";
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  // Handle "30 Sep 2026" or other date string formats without timezone day-shift
  const d = new Date(trimmed);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr || !dateStr.trim()) return "No Due Date";
  const trimmed = dateStr.trim();

  // If input format is YYYY-MM-DD
  const parts = trimmed.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    }
  }

  const d = new Date(trimmed);
  if (isNaN(d.getTime())) return trimmed;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AddProjectModal({
  isOpen,
  onClose,
  onSave,
  initialStatus = "Planned",
  initialProject = null,
}: AddProjectModalProps) {
  const { activeWorkspace } = useWorkspace();
  const { currentColorHex } = useTheme();

  const [name, setName] = useState("");
  const [priority, setPriority] = useState<PriorityType>("High");
  const [status, setStatus] = useState<StatusType>(initialStatus);
  const [memberNames, setMemberNames] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [team, setTeam] = useState("");
  const [labels, setLabels] = useState("");
  const [reporter, setReporter] = useState("");

  const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([]);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showReporterDropdown, setShowReporterDropdown] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const memberDropdownRef = useRef<HTMLDivElement>(null);
  const reporterDropdownRef = useRef<HTMLDivElement>(null);

  const loadWorkspaceMembers = async () => {
    if (!activeWorkspace?.id) return;
    try {
      const data = await inviteService.getWorkspaceMembers(activeWorkspace.id);
      setWorkspaceMembers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load workspace members", e);
    }
  };

  useEffect(() => {
    if (isOpen && activeWorkspace?.id) {
      loadWorkspaceMembers();
    }
  }, [isOpen, activeWorkspace?.id]);

  useEffect(() => {
    if (isOpen) {
      if (initialProject) {
        setName(initialProject.name || "");
        setPriority(initialProject.priority || "High");
        setStatus(initialProject.status || initialStatus);
        setMemberNames(initialProject.members?.map((m) => m.name).join(", ") || "");
        setDueDate(toInputDateString(initialProject.dueDate));
        setTeam(initialProject.teams?.[0] || "");
        setLabels(initialProject.labels?.join(", ") || "");
        setReporter(initialProject.reporter || "");
      } else {
        setName("");
        setPriority("High");
        setStatus(initialStatus);
        setMemberNames("");
        setDueDate("");
        setTeam("");
        setLabels("");
        setReporter("");
      }
    }
  }, [isOpen, initialProject, initialStatus]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target as Node)) {
        setShowMemberDropdown(false);
      }
      if (reporterDropdownRef.current && !reporterDropdownRef.current.contains(event.target as Node)) {
        setShowReporterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const toggleMemberSelect = (memberName: string) => {
    const currentMembers = memberNames
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    if (currentMembers.includes(memberName)) {
      const updated = currentMembers.filter((m) => m !== memberName);
      setMemberNames(updated.join(", "));
    } else {
      currentMembers.push(memberName);
      setMemberNames(currentMembers.join(", "));
    }
  };

  const selectedMemberList = memberNames
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedMembers = memberNames
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((mem, idx) => {
        const found = workspaceMembers.find(
          (wm) => (wm.fullName || wm.username || "").toLowerCase() === mem.toLowerCase()
        );
        return {
          id: found?.userId || found?.id || `m-${Date.now()}-${idx}`,
          userId: found?.userId || found?.id,
          name: found?.fullName || found?.username || mem,
          initials: (found?.fullName || found?.username || mem)
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
          avatar: found?.avatarUrl,
        };
      });

    const parsedLabels = labels
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newProject: Project = {
      id: initialProject ? initialProject.id : `p-${Date.now()}`,
      name: name.trim(),
      priority,
      status,
      members: parsedMembers,
      dueDate: formatDisplayDate(dueDate),
      teams: team ? [team] : [],
      labels: parsedLabels,
      reporter: reporter.trim(),
    };

    onSave(newProject);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#171717] rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-2xl w-full max-w-md p-5 flex flex-col gap-4 transition-colors animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
            <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F5F5F5]">
              {initialProject ? "Edit Project" : "Create New Project"}
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors p-1 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Inputs */}
          <div className="flex flex-col gap-3">
            {/* Project Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                Project Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mobile App Redesign"
                className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] rounded-md focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
                autoFocus
              />
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusType)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] rounded-md focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityType)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] rounded-md focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="No Priority">No Priority</option>
                </select>
              </div>
            </div>

            {/* Due Date & Team */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] rounded-md focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3] cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                  Team
                </label>
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] rounded-md focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
                >
                  <option value="">Select Team</option>
                  <option value="Design">Design</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>

            {/* Members & Reporter */}
            <div className="grid grid-cols-2 gap-3">
              {/* Members Input with Dropdown */}
              <div className="flex flex-col gap-1 relative" ref={memberDropdownRef}>
                <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                  Lead
                </label>

                <input
                  type="text"
                  value={reporter}
                  onFocus={() => setShowMemberDropdown(true)}
                  onChange={(e) => {
                    setReporter(e.target.value);
                    setShowMemberDropdown(true);
                  }}
                  placeholder="Select lead..."
                  className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] rounded-md focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
                />

                {/* Lead Dropdown Menu */}
                {showMemberDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg shadow-xl z-50 p-1 max-h-48 overflow-y-auto flex flex-col gap-0.5">
                    <div className="px-2 py-1 border-b border-[#F0F0F0] dark:border-[#262626] mb-1">
                      <span className="text-[10px] font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
                        Workspace Members
                      </span>
                    </div>

                    {workspaceMembers.length === 0 ? (
                      <div className="p-2 text-center text-xs text-[#737373] dark:text-[#A3A3A3]">
                        No members found.
                      </div>
                    ) : (
                      workspaceMembers.map((m) => {
                        const memberName = m.fullName || m.username || m.email || "Member";
                        const isSelected = reporter.toLowerCase() === memberName.toLowerCase();

                        return (
                          <button
                            key={m.id || m.userId}
                            type="button"
                            onClick={() => {
                              setReporter(memberName);
                              setShowMemberDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors text-left cursor-pointer ${isSelected
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

                    {/* Single Invite Action Row matching Application Theme */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsInviteModalOpen(true);
                        setShowMemberDropdown(false);
                      }}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 mt-1 rounded text-xs font-semibold hover:bg-[#F5F5F5] dark:hover:bg-[#262626] border-t border-[#F0F0F0] dark:border-[#262626] cursor-pointer transition-colors"
                      style={{ color: currentColorHex }}
                    >
                      <UserPlus size={12} style={{ color: currentColorHex }} />
                      <span>+ Invite New Member</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Labels */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                Labels (comma separated)
              </label>
              <input
                type="text"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                placeholder="e.g. Design, UI, Feature"
                className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] rounded-md focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
              />
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
            <button
              onClick={onClose}
              type="button"
              className="px-3 py-1.5 text-xs font-medium text-[#171717] dark:text-[#F5F5F5] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-white dark:text-black bg-[#171717] dark:bg-[#F5F5F5] rounded-md hover:bg-[#262626] dark:hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              {initialProject ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>

      {/* Invite Modal for sending emails to new members */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSent={() => {
          loadWorkspaceMembers();
        }}
      />
    </>
  );
}
