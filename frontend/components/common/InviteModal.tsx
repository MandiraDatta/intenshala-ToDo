"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Send, CheckCircle2, AlertCircle, Loader2, X, Users, Mail, Search, UserPlus, FolderKanban } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useTheme } from "@/context/ThemeContext";
import { inviteService } from "@/services/invite.service";
import { projectService } from "@/services/project.service";

interface ExistingWorkspaceMember {
  id: string;
  userId: string;
  role: string;
  fullName: string;
  username: string;
  email: string;
  title?: string;
  avatarUrl?: string;
}

interface WorkspaceProject {
  id: string;
  name: string;
}

export interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent?: () => void;
  taskId?: string;
  projectId?: string;
}

export default function InviteModal({
  isOpen,
  onClose,
  onInviteSent,
  taskId,
  projectId,
}: InviteModalProps) {
  const { activeWorkspace } = useWorkspace();
  const { currentColorHex } = useTheme();

  const [activeTab, setActiveTab] = useState<"existing" | "invite_mail">("existing");

  // Project selector state
  const [projectsList, setProjectsList] = useState<WorkspaceProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || "");

  // Email tab state
  const [emailInput, setEmailInput] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Existing members tab state
  const [existingMembers, setExistingMembers] = useState<ExistingWorkspaceMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [invitingMemberId, setInvitingMemberId] = useState<string | null>(null);

  // Feedback state
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load existing workspace members and projects when modal opens
  useEffect(() => {
    if (isOpen && activeWorkspace?.id) {
      setLoadingMembers(true);
      
      // Load members
      inviteService
        .getWorkspaceMembers(activeWorkspace.id)
        .then((data) => {
          setExistingMembers(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error("Failed to load workspace members", err);
        })
        .finally(() => {
          setLoadingMembers(false);
        });

      // Load projects for project context selection
      projectService
        .getProjects(activeWorkspace.id)
        .then((res) => {
          const list = Array.isArray(res?.data) ? res.data : [];
          setProjectsList(list);
          if (!projectId && list.length > 0) {
            setSelectedProjectId(list[0].id);
          }
        })
        .catch((err) => {
          console.error("Failed to load workspace projects", err);
        });
    }
  }, [isOpen, activeWorkspace?.id, projectId]);

  if (!isOpen) return null;

  const effectiveProjectId = projectId || selectedProjectId;

  // Handle inviting via email (Tab 2)
  const handleSendInviteEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !activeWorkspace?.id) return;

    setSendingEmail(true);
    setFeedback(null);
    try {
      await inviteService.sendInvite(activeWorkspace.id, emailInput.trim(), 'MEMBER', taskId, effectiveProjectId);
      setFeedback({
        type: "success",
        message: `Invite email sent via Resend to ${emailInput.trim()}! Member will appear once accepted.`,
      });
      setEmailInput("");
      if (onInviteSent) onInviteSent();
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 2500);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to send invite email.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Handle inviting existing workspace member (Tab 1)
  const handleInviteExistingMember = async (member: ExistingWorkspaceMember) => {
    if (!activeWorkspace?.id || !member.email) return;

    setInvitingMemberId(member.id);
    setFeedback(null);
    try {
      await inviteService.sendInvite(activeWorkspace.id, member.email, 'MEMBER', taskId, effectiveProjectId);
      setFeedback({
        type: "success",
        message: `Invitation email sent to ${member.fullName}! Member will appear once they accept.`,
      });
      if (onInviteSent) onInviteSent();
      setTimeout(() => {
        setFeedback(null);
      }, 3000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || `Failed to send invite to ${member.fullName}.`,
      });
    } finally {
      setInvitingMemberId(null);
    }
  };

  // Filtered existing members list
  const filteredExistingMembers = existingMembers.filter((m) => {
    const query = memberSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      m.fullName?.toLowerCase().includes(query) ||
      m.username?.toLowerCase().includes(query) ||
      m.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl shadow-2xl p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150 transition-colors"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2.5">
          <div className="flex items-center gap-2">
            <UserPlus size={16} style={{ color: currentColorHex }} />
            <span className="text-xs font-bold text-[#171717] dark:text-[#F5F5F5]">
              Add Members & Send Invite
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors p-1 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs Navigation matching theme */}
        <div className="flex items-center gap-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("existing");
              setFeedback(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "existing"
                ? "bg-[#F5F5F5] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5] shadow-2xs"
                : "text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5]"
            }`}
            style={
              activeTab === "existing"
                ? { borderBottom: `2px solid ${currentColorHex}` }
                : {}
            }
          >
            <Users size={13} />
            <span>Existing Members</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("invite_mail");
              setFeedback(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "invite_mail"
                ? "bg-[#F5F5F5] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5] shadow-2xs"
                : "text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5]"
            }`}
            style={
              activeTab === "invite_mail"
                ? { borderBottom: `2px solid ${currentColorHex}` }
                : {}
            }
          >
            <Mail size={13} />
            <span>Invite via Mail</span>
          </button>
        </div>

        {/* Project Access Context Selector */}
        {projectsList.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-[#737373] dark:text-[#A3A3A3] flex items-center gap-1">
              <FolderKanban className="w-3 h-3 text-[#737373]" />
              <span>Grant Access To Project</span>
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="h-8 px-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded-lg text-xs text-[#171717] dark:text-[#F5F5F5] outline-none cursor-pointer"
            >
              {projectsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tab 1: Existing Workspace Members */}
        {activeTab === "existing" && (
          <div className="flex flex-col gap-2.5">
            {/* Search Member input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#A3A3A3]" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search existing members..."
                className="w-full h-8.5 pl-8 pr-3 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded-lg text-xs text-[#171717] dark:text-[#F5F5F5] outline-none focus:border-opacity-100 transition-colors"
              />
            </div>

            {/* Members List */}
            <div className="max-h-48 overflow-y-auto flex flex-col gap-1.5 pr-1">
              {loadingMembers ? (
                <div className="py-6 text-center text-xs text-[#737373] dark:text-[#A3A3A3] flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading members...</span>
                </div>
              ) : filteredExistingMembers.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#737373] dark:text-[#A3A3A3]">
                  No existing members found.
                </div>
              ) : (
                filteredExistingMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#202020] border border-[#F0F0F0] dark:border-[#2A2A2A] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs"
                        style={{ backgroundColor: currentColorHex }}
                      >
                        {member.avatarUrl ? (
                          <Image
                            src={member.avatarUrl}
                            alt={member.fullName}
                            width={28}
                            height={28}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          (member.fullName || member.username || "M")[0].toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5] truncate">
                          {member.fullName}
                        </span>
                        <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3] truncate">
                          {member.email}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={invitingMemberId === member.id}
                      onClick={() => handleInviteExistingMember(member)}
                      className="px-2.5 py-1 text-xs font-semibold text-white rounded-md transition-colors cursor-pointer shrink-0 shadow-2xs disabled:opacity-50 flex items-center gap-1"
                      style={{ backgroundColor: currentColorHex }}
                    >
                      {invitingMemberId === member.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send size={11} />
                      )}
                      <span>Invite</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Invite via Mail */}
        {activeTab === "invite_mail" && (
          <form onSubmit={handleSendInviteEmail} className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-[#737373] dark:text-[#A3A3A3]">
                Enter Recipient Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. user@company.com"
                className="h-9 px-3 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded-lg text-xs text-[#171717] dark:text-[#F5F5F5] outline-none transition-colors w-full"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={sendingEmail || !emailInput.trim()}
              className="h-8.5 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 w-full shadow-2xs disabled:opacity-50"
              style={{ backgroundColor: currentColorHex }}
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Invite Email...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Send Resend Invite Email</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Feedback notification */}
        {feedback && (
          <div
            className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
              feedback.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle size={14} className="shrink-0 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
