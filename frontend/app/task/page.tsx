"use client";

import Sidebar from "@/components/sidebar";
import {
  PanelLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Lock,
  Eye,
  Share2,
  LayoutGrid,
  Calendar as CalendarIcon,
  Plus,
  SendHorizontal,
  SmilePlus,
  UserPlus,
  Settings,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Signal,
  MoreHorizontal,
  Check,
  Tag,
  Users,
  User,
  Link2,
} from "lucide-react";
import { RiAttachmentLine } from "@remixicon/react";
import { Circle } from "@phosphor-icons/react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useUser } from "@/context/UserContext";
import { taskService } from "@/services/task.service";
import MemberAvatarStack from "@/components/common/MemberAvatarStack";

interface Subtask {
  id: string;
  title: string;
  priority: string;
  members: string;
  dueDate: string;
}

interface CommentItem {
  id: string;
  author: string;
  time: string;
  content: string;
}

function TaskDetailContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");
  const projectId = searchParams.get("projectId");
  const { activeWorkspace } = useWorkspace();
  const { user } = useUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [subtasksOpen, setSubtasksOpen] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Active popover identifier ('status' | 'priority' | 'members' | 'dates' | 'labels' | 'teams' | 'reporter' | null)
  const [activePopover, setActivePopover] = useState<string | null>(null);

  // Dynamic field states initialized empty (0 static mock data)
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [assignedMembers, setAssignedMembers] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [team, setTeam] = useState("");
  const [reporter, setReporter] = useState("");

  // Subtasks & Comments initialized empty
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // Updates audit log initialized empty
  const [updatesList, setUpdatesList] = useState<
    { id: string; user: string; text: string; time: string; avatarColor: string }[]
  >([]);

  const addUpdateLog = (text: string) => {
    setUpdatesList((prev) => [
      {
        id: `u-${Date.now()}`,
        user: user?.fullName || "You",
        text,
        time: "Just now",
        avatarColor: "bg-purple-500",
      },
      ...prev,
    ]);
  };

  // Fetch real task details if ID or projectId exists
  useEffect(() => {
    if ((!taskId && !projectId) || !activeWorkspace?.id) {
      setReporter(user?.fullName || "Admin");
      setAssignedMembers(user?.fullName ? [user.fullName] : []);
      return;
    }

    const fetchTask = async () => {
      setLoading(true);
      try {
        let data = null;
        if (taskId) {
          data = await taskService.getTaskById(activeWorkspace.id, taskId);
        } else if (projectId) {
          const res = await taskService.getTasks(activeWorkspace.id, { projectId });
          const tasksList = res.data || res || [];
          if (Array.isArray(tasksList) && tasksList.length > 0) {
            data = tasksList[0];
          }
        }

        if (data) {
          if (data.title) setTaskTitle(data.title);
          if (data.description) setDescription(data.description);
          if (data.status) setStatus(data.status.toUpperCase());
          if (data.priority) setPriority(data.priority.toUpperCase());
          if (data.members && data.members.length > 0) {
            setAssignedMembers(
              data.members.map((m: any) => m.user?.fullName || m.fullName || "Member")
            );
          } else if (user?.fullName) {
            setAssignedMembers([user.fullName]);
          }
          if (data.labels && data.labels.length > 0) {
            setSelectedLabels(data.labels.map((l: any) => l.label?.name || l.name || "Label"));
          }
          if (data.createdBy?.fullName) {
            setReporter(data.createdBy.fullName);
          } else if (user?.fullName) {
            setReporter(user.fullName);
          }
        } else {
          setReporter(user?.fullName || "Admin");
          setAssignedMembers(user?.fullName ? [user.fullName] : []);
        }
      } catch (err) {
        console.error("Failed to load task details from backend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, projectId, activeWorkspace?.id, user?.fullName]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newC: CommentItem = {
      id: `c-${Date.now()}`,
      author: user?.fullName || "User",
      time: "just now",
      content: commentText.trim(),
    };
    setComments((prev) => [...prev, newC]);
    setCommentText("");
    addUpdateLog("posted an update");
  };

  const handleCreateSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSt: Subtask = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      priority: priority === "HIGH" || priority === "URGENT" ? "High" : priority === "LOW" ? "Low" : "Medium",
      members: user?.fullName ? user.fullName.charAt(0) : "A",
      dueDate: selectedDate ? `${selectedDate} Jan` : "No Date",
    };
    setSubtasks((prev) => [...prev, newSt]);
    setNewSubtaskTitle("");
    setIsAddingSubtask(false);
    addUpdateLog(`added subtask "${newSt.title}"`);
  };

  const renderPriorityIcon = (p: string) => {
    const pUpper = (p || "MEDIUM").toUpperCase();
    switch (pUpper) {
      case "URGENT":
      case "HIGH":
        return <SignalHigh size={13} className="text-rose-600 dark:text-rose-400 stroke-[2.5]" />;
      case "MEDIUM":
        return <SignalMedium size={13} className="text-amber-600 dark:text-amber-400 stroke-[2.5]" />;
      case "LOW":
        return <SignalLow size={13} className="text-slate-600 dark:text-slate-300 stroke-[2.5]" />;
      default:
        return <Signal size={13} className="text-neutral-600 dark:text-neutral-400 stroke-[2.5]" />;
    }
  };

  const statusDisplayMap: Record<string, string> = {
    TODO: "To Do",
    DOING: "In Progress",
    COMPLETED: "Completed",
    ON_HOLD: "On Hold",
    BACKLOG: "Backlog",
  };

  const priorityDisplayMap: Record<string, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex text-[#171717] dark:text-[#F5F5F5] font-sans transition-colors duration-200">
      {/* Click Backdrop to close popovers */}
      {activePopover !== null && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setActivePopover(null)}
        />
      )}

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-200 relative z-0">
        {/* Top Header Bar matching Figma */}
        <header className="h-12 border-b border-[#E5E5E5] dark:border-[#2A2A2A] px-4 sm:px-6 flex items-center justify-between bg-white dark:bg-[#111111] shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="p-1 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded text-[#171717] dark:text-[#F5F5F5] transition-colors"
              title="Toggle Sidebar"
            >
              <PanelLeft size={16} className="stroke-[2.2]" />
            </Link>
          </div>
        </header>

        {/* Task Content Area */}
        <div className="flex-1 overflow-y-auto w-full">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#737373] dark:text-[#A3A3A3]">
              Loading task details...
            </div>
          ) : (
            <div className="w-full px-6 sm:px-10 py-6 max-w-full flex flex-col gap-4">
              {/* Top Task Title & Action Items Row */}
              <div className="flex items-center justify-between gap-4 w-full">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onBlur={() => {
                    if (taskId && activeWorkspace?.id && taskTitle.trim()) {
                      taskService.updateTask(activeWorkspace.id, taskId, { title: taskTitle.trim() }).catch(() => {});
                    }
                  }}
                  placeholder="Untitled Task"
                  className="text-2xl font-bold text-[#171717] dark:text-[#F5F5F5] tracking-tight bg-transparent border-b border-transparent hover:border-[#E5E5E5] focus:border-[#171717] dark:focus:border-[#F5F5F5] focus:outline-none w-full"
                />

                {/* Action Items matching Figma */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer"
                    title="Lock Task"
                  >
                    <Lock size={14} className="stroke-[2.2]" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-2 py-1 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye size={13} className="stroke-[2.2]" />
                    <span>1</span>
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer"
                    title="Share"
                  >
                    <Share2 size={14} className="stroke-[2.2]" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer"
                    title="More Options"
                  >
                    <MoreHorizontal size={14} className="stroke-[2.2]" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer"
                    title="Split View"
                  >
                    <LayoutGrid size={14} className="stroke-[2.2]" />
                  </button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-[24px] items-start w-full">
                {/* Left Main Details Column */}
                <main className="min-w-0 flex flex-col gap-[20px] w-full">
                  {/* Description matching Figma specs */}
                  <div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onBlur={() => {
                        if (taskId && activeWorkspace?.id) {
                          taskService.updateTask(activeWorkspace.id, taskId, { description: description.trim() }).catch(() => {});
                        }
                      }}
                      placeholder="Add detailed task description..."
                      className="w-full text-sm leading-[20px] text-[#525252] dark:text-neutral-300 max-w-[581px] min-h-[40px] bg-transparent border border-transparent hover:border-[#E5E5E5] focus:border-[#171717] dark:focus:border-[#F5F5F5] rounded p-1 focus:outline-none resize-y"
                    />
                  </div>

                  {/* Properties, Labels and Resources */}
                  <div className="flex flex-col gap-3 pt-1 min-h-[108px]">
                    {/* Properties */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 w-20 font-semibold shrink-0">Properties</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <MemberAvatarStack
                          members={assignedMembers.map((m) => ({
                            id: m,
                            name: m,
                            initials: m.charAt(0).toUpperCase(),
                          }))}
                        />

                        {selectedDate && (
                          <div className="h-6 px-2 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            <CalendarIcon size={12} className="stroke-[2.2]" />
                            <span>{selectedDate} Jan</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 w-20 font-semibold shrink-0">Labels</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {selectedLabels.length > 0 ? (
                          selectedLabels.map((label) => (
                            <span
                              key={label}
                              className="h-6 px-2.5 rounded-full bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                            >
                              <Tag size={11} className="text-neutral-600 dark:text-neutral-400 stroke-[2.2]" />
                              <span>{label}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-neutral-400 font-medium">No labels added</span>
                        )}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 w-20 font-semibold shrink-0">Resources</span>
                      <button
                        type="button"
                        className="h-6 px-2.5 rounded-full border border-dashed border-[#CBD5E1] dark:border-[#2A2A2A] text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-[#F8FAFC] dark:hover:bg-[#262626] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Link2 size={11} className="stroke-[2.2]" />
                        <span>Add document or link...</span>
                      </button>
                    </div>
                  </div>

                  {/* Subtasks Collapsible Table */}
                  <div className="flex flex-col gap-4 min-h-[260px]">
                    <button
                      type="button"
                      onClick={() => setSubtasksOpen(!subtasksOpen)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#171717] dark:text-[#F5F5F5] cursor-pointer select-none py-0.5"
                    >
                      {subtasksOpen ? <ChevronDown size={14} className="stroke-[2.5] text-neutral-800 dark:text-neutral-200" /> : <ChevronRight size={14} className="stroke-[2.5] text-neutral-800 dark:text-neutral-200" />}
                      <span>Subtasks ({subtasks.length})</span>
                    </button>

                    {subtasksOpen && (
                      <div className="w-full overflow-x-auto border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#171717]">
                        <div className="min-w-[480px] flex flex-col">
                          {/* Header height 40px */}
                          <div className="w-full h-10 grid grid-cols-5 items-center px-3 bg-[#FAFAFA] dark:bg-[#111111] border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            <div>Task</div>
                            <div>Priority</div>
                            <div>Members</div>
                            <div>Due Date</div>
                            <div className="text-right pr-1">Actions</div>
                          </div>

                          {/* Subtask Rows */}
                          {subtasks.length === 0 ? (
                            <div className="py-6 px-4 text-center text-xs text-neutral-400 font-medium">
                              No subtasks created yet. Click "+ Add Subtasks" below to add one.
                            </div>
                          ) : (
                            subtasks.map((subtask) => (
                              <div
                                key={subtask.id}
                                className="w-full h-10 grid grid-cols-5 items-center px-3 border-b border-[#F0F0F0] dark:border-[#2A2A2A] hover:bg-[#FAFAFA] dark:hover:bg-[#262626] text-xs text-[#171717] dark:text-[#F5F5F5] transition-colors"
                              >
                                <div className="font-semibold truncate pr-2">{subtask.title}</div>
                                <div>
                                  {subtask.priority === "High" ? (
                                    <span className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                                      <SignalHigh size={12} className="stroke-[2.5]" /> High
                                    </span>
                                  ) : subtask.priority === "Medium" ? (
                                    <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                      <SignalMedium size={12} className="stroke-[2.5]" /> Medium
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                                      <SignalLow size={12} className="stroke-[2.5]" /> Low
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                                    {subtask.members}
                                  </div>
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">{subtask.dueDate}</div>
                                <div className="flex justify-end pr-1">
                                  <button
                                    type="button"
                                    onClick={() => setSubtasks((prev) => prev.filter((s) => s.id !== subtask.id))}
                                    className="text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 p-1 cursor-pointer"
                                  >
                                    <MoreHorizontal size={14} className="stroke-[2.2]" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}

                          {/* Add Subtask Form / Button */}
                          {isAddingSubtask ? (
                            <form onSubmit={handleCreateSubtask} className="p-2 flex items-center gap-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                              <input
                                type="text"
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                placeholder="Enter subtask title..."
                                autoFocus
                                className="flex-1 px-3 py-1 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] rounded focus:outline-none"
                              />
                              <button
                                type="submit"
                                className="px-3 py-1 text-xs font-semibold text-white bg-[#171717] dark:bg-[#F5F5F5] dark:text-black rounded cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsAddingSubtask(false)}
                                className="px-2 py-1 text-xs font-medium text-neutral-500 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <div className="h-10 flex items-center px-3 bg-white dark:bg-[#171717]">
                              <button
                                type="button"
                                onClick={() => setIsAddingSubtask(true)}
                                className="flex items-center gap-1 text-xs text-neutral-800 dark:text-neutral-200 font-semibold hover:text-black dark:hover:text-white cursor-pointer"
                              >
                                <Plus size={13} className="stroke-[2.5]" />
                                <span>Add Subtasks</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subtasks & Activity Section */}
                  <div className="flex flex-col gap-4 pt-1 min-h-[171px]">
                    <span className="text-xs font-bold text-[#171717] dark:text-[#F5F5F5]">Comments ({comments.length})</span>

                    {/* Comments List */}
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex flex-col rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#171717] overflow-hidden"
                      >
                        <div className="p-4 flex items-start gap-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                          <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {comment.author.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#171717] dark:text-[#F5F5F5]">{comment.author}</span>
                              <span className="text-[10px] text-neutral-500 font-medium">{comment.time}</span>
                            </div>
                            <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mt-1">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
                            <button type="button" className="hover:text-black dark:hover:text-white p-1 cursor-pointer">
                              <SmilePlus size={15} className="stroke-[2.2] text-neutral-700 dark:text-neutral-200" />
                            </button>
                            <button type="button" className="hover:text-black dark:hover:text-white p-1 cursor-pointer">
                              <MoreHorizontal size={14} className="stroke-[2.2]" />
                            </button>
                          </div>
                        </div>

                        {/* Reply Input Box */}
                        <div className="h-[47px] flex items-center gap-2.5 px-3 bg-white dark:bg-[#171717]">
                          <div className="w-5 h-5 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {user?.fullName ? user.fullName.charAt(0) : "U"}
                          </div>
                          <input
                            type="text"
                            placeholder="Leave a reply..."
                            value={replyTextMap[comment.id] || ""}
                            onChange={(e) => setReplyTextMap((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                            className="flex-1 text-xs outline-none bg-transparent font-medium text-[#171717] dark:text-[#F5F5F5] placeholder:text-neutral-500"
                          />
                          <button type="button" className="text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white p-1 cursor-pointer">
                            <RiAttachmentLine className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
                          </button>
                          <button type="button" className="text-[#171717] dark:text-[#F5F5F5] hover:text-black dark:hover:text-white p-1 cursor-pointer">
                            <SendHorizontal size={15} className="stroke-[2.5] text-[#171717] dark:text-[#F5F5F5]" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Comment Input Box */}
                    <form
                      onSubmit={handleAddComment}
                      className="h-[64px] flex items-center gap-[10px] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md px-4 bg-white dark:bg-[#171717]"
                    >
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 text-xs outline-none bg-transparent font-medium text-[#171717] dark:text-[#F5F5F5] placeholder:text-neutral-500"
                      />
                      <button type="button" className="text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white p-1 cursor-pointer">
                        <RiAttachmentLine className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
                      </button>
                      <button type="submit" className="text-[#171717] dark:text-[#F5F5F5] hover:text-black dark:hover:text-white p-1 cursor-pointer">
                        <SendHorizontal size={15} className="stroke-[2.5] text-[#171717] dark:text-[#F5F5F5]" />
                      </button>
                    </form>
                  </div>
                </main>

                {/* Details Sidebar Panel */}
                <aside className="w-full lg:w-[340px] shrink-0 flex flex-col gap-[20px] relative z-30">
                  <div className="border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#171717] p-3.5 flex flex-col gap-3 relative">
                    {/* Details Header */}
                    <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
                      <div className="flex items-center gap-1 text-xs font-bold text-[#171717] dark:text-[#F5F5F5]">
                        <span>▾ Details</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white p-0.5 cursor-pointer">
                          <Plus size={14} className="stroke-[2.5]" />
                        </button>
                        <button type="button" className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white p-0.5 cursor-pointer">
                          <Settings size={14} className="stroke-[2.2]" />
                        </button>
                      </div>
                    </div>

                    {/* 1. Status */}
                    <div className="relative flex items-center justify-between text-xs py-0.5 h-7">
                      <span className="text-neutral-600 dark:text-neutral-400 font-semibold">Status</span>
                      <button
                        type="button"
                        onClick={() => setActivePopover(activePopover === "status" ? null : "status")}
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
                      >
                        <Circle weight="fill" className="w-2 h-2 text-amber-500" />
                        <span>{statusDisplayMap[status] || status}</span>
                      </button>

                      {/* Status Popover */}
                      {activePopover === "status" && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-[192px] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-md p-2 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
                          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 px-2 py-1">Status</div>
                          {[
                            { label: "Backlog", color: "text-amber-500", code: "BACKLOG" },
                            { label: "To Do", color: "text-blue-500", code: "TODO" },
                            { label: "In Progress", color: "text-yellow-500", code: "DOING" },
                            { label: "Completed", color: "text-emerald-500", code: "COMPLETED" },
                            { label: "Canceled", color: "text-neutral-400", code: "ON_HOLD" },
                          ].map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => {
                                const oldS = status;
                                setStatus(item.code);
                                setActivePopover(null);
                                addUpdateLog(`changed status from ${oldS} to ${item.label}`);
                                if (taskId && activeWorkspace?.id) {
                                  taskService.updateTaskStatus(activeWorkspace.id, taskId, item.code).catch(() => {});
                                }
                              }}
                              className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-2">
                                <Circle weight="fill" className={`w-2 h-2 ${item.color}`} />
                                <span className="font-semibold">{item.label}</span>
                              </div>
                              {(status === item.code || status === item.label) && <Check size={14} className="text-neutral-900 dark:text-neutral-100 stroke-[2.5]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 2. Priority */}
                    <div className="relative flex items-center justify-between text-xs py-0.5 h-7">
                      <span className="text-neutral-600 dark:text-neutral-400 font-semibold">Priority</span>
                      <button
                        type="button"
                        onClick={() => setActivePopover(activePopover === "priority" ? null : "priority")}
                        className="flex items-center gap-1 font-semibold text-xs cursor-pointer hover:bg-neutral-100 dark:hover:bg-[#262626] px-1.5 py-0.5 rounded transition-colors"
                      >
                        {renderPriorityIcon(priority)}
                        <span className={priority === "URGENT" || priority === "HIGH" ? "text-rose-600 dark:text-rose-400 font-bold" : "text-neutral-800 dark:text-neutral-200"}>
                          {priorityDisplayMap[priority] || priority}
                        </span>
                        {activePopover === "priority" ? <ChevronUp size={12} className="text-neutral-600 dark:text-neutral-400 stroke-[2.5]" /> : <ChevronDown size={12} className="text-neutral-600 dark:text-neutral-400 stroke-[2.5]" />}
                      </button>

                      {/* Priority Popover */}
                      {activePopover === "priority" && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-[192px] min-h-[229px] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-md p-2 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
                          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 px-2 py-1">Priority</div>
                          {[
                            { label: "No Priority", icon: <Signal size={13} className="text-neutral-500 stroke-[2.5]" />, code: "LOW" },
                            { label: "Urgent", icon: <SignalHigh size={13} className="text-rose-600 stroke-[2.5]" />, textClass: "text-rose-600 font-bold", code: "URGENT" },
                            { label: "High", icon: <SignalHigh size={13} className="text-rose-600 stroke-[2.5]" />, textClass: "text-rose-600 font-bold", code: "HIGH" },
                            { label: "Medium", icon: <SignalMedium size={13} className="text-amber-600 stroke-[2.5]" />, textClass: "text-amber-600 font-bold", code: "MEDIUM" },
                            { label: "Low", icon: <SignalLow size={13} className="text-slate-500 stroke-[2.5]" />, code: "LOW" },
                          ].map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => {
                                const oldP = priority;
                                setPriority(item.code);
                                setActivePopover(null);
                                addUpdateLog(`changed priority from ${oldP} to ${item.label}`);
                                if (taskId && activeWorkspace?.id) {
                                  taskService.updateTask(activeWorkspace.id, taskId, { priority: item.code }).catch(() => {});
                                }
                              }}
                              className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-2">
                                {item.icon}
                                <span className={item.textClass || "text-neutral-800 dark:text-neutral-200 font-semibold"}>{item.label}</span>
                              </div>
                              {priority === item.code && <Check size={14} className="text-neutral-900 dark:text-neutral-100 stroke-[2.5]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 3. Members */}
                    <div className="relative flex items-center justify-between text-xs py-0.5 h-7">
                      <span className="text-neutral-600 dark:text-neutral-400 font-semibold">Members</span>
                      <button
                        type="button"
                        onClick={() => setActivePopover(activePopover === "members" ? null : "members")}
                        className="flex items-center gap-1 text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white text-xs font-semibold cursor-pointer"
                      >
                        <UserPlus size={12} className="stroke-[2.2]" />
                        <span>{assignedMembers.length > 0 ? assignedMembers.join(", ") : "Add members"}</span>
                      </button>

                      {/* Members Popover */}
                      {activePopover === "members" && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-[192px] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-md p-2 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
                          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 px-2 py-1">Assignees</div>
                          {["Ankit Datta", "Pooja Shree", "Dexter", "QA Team"].map((mem) => {
                            const isAssigned = assignedMembers.includes(mem);
                            return (
                              <button
                                key={mem}
                                type="button"
                                onClick={() => {
                                  setAssignedMembers((prev) =>
                                    isAssigned ? prev.filter((m) => m !== mem) : [...prev, mem]
                                  );
                                }}
                                className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors cursor-pointer text-left font-semibold"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-4.5 h-4.5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold">
                                    {mem[0]}
                                  </div>
                                  <span className="truncate">{mem}</span>
                                </div>
                                {isAssigned && <Check size={14} className="text-neutral-900 dark:text-neutral-100 stroke-[2.5] shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 4. Dates */}
                    <div className="relative flex items-center justify-between text-xs py-0.5 h-7">
                      <span className="text-neutral-600 dark:text-neutral-400 font-semibold">Dates</span>
                      <button
                        type="button"
                        onClick={() => setActivePopover(activePopover === "dates" ? null : "dates")}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs text-[#171717] dark:text-[#F5F5F5] font-semibold hover:border-neutral-400 transition-colors cursor-pointer"
                      >
                        <span className="font-bold">{selectedDate ? `Jan ${selectedDate}` : "Select date"}</span>
                        <span className="text-neutral-400">→</span>
                        <span className="text-neutral-400">End</span>
                      </button>

                      {/* Calendar Popover */}
                      {activePopover === "dates" && (
                        <div className="absolute right-0 top-full mt-1.5 z-50 w-72 bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-md p-3 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-100">
                          {/* Month Navigator */}
                          <div className="flex items-center justify-between text-xs font-bold text-[#171717] dark:text-[#F5F5F5] px-1">
                            <button type="button" className="p-1 text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white rounded">
                              <ChevronLeft size={14} className="stroke-[2.5]" />
                            </button>
                            <span>January 2026</span>
                            <button type="button" className="p-1 text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white rounded">
                              <ChevronRight size={14} className="stroke-[2.5]" />
                            </button>
                          </div>

                          {/* Day Headers */}
                          <div className="grid grid-cols-7 text-center text-[10px] text-neutral-500 font-bold">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                              <span key={day}>{day}</span>
                            ))}
                          </div>

                          {/* Calendar Grid */}
                          <div className="grid grid-cols-7 text-center text-xs font-bold gap-y-1 relative">
                            {[30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3].map((d, index) => {
                              const isOtherMonth = index === 0 || index > 31;
                              const isSelected = selectedDate === d && !isOtherMonth;

                              return (
                                <div key={index} className="flex flex-col items-center justify-center relative py-0.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDate(d);
                                      setActivePopover(null);
                                      addUpdateLog(`changed date to Jan ${d}`);
                                    }}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${isSelected
                                      ? "bg-[#171717] dark:bg-[#F5F5F5] text-white dark:text-black font-extrabold"
                                      : isOtherMonth
                                        ? "text-neutral-300 dark:text-neutral-700"
                                        : "text-[#171717] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#262626]"
                                      }`}
                                  >
                                    {d}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 5. Labels */}
                    <div className="relative flex items-center justify-between text-xs py-0.5 h-7">
                      <span className="text-neutral-600 dark:text-neutral-400 font-semibold">Labels</span>
                      <button
                        type="button"
                        onClick={() => setActivePopover(activePopover === "labels" ? null : "labels")}
                        className="flex items-center gap-1 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white font-semibold text-xs cursor-pointer truncate max-w-[140px]"
                      >
                        <Tag size={12} className="text-neutral-500 shrink-0 stroke-[2.2]" />
                        <span className="truncate">{selectedLabels.length > 0 ? selectedLabels.join(", ") : "Add label"}</span>
                      </button>

                      {/* Labels Popover */}
                      {activePopover === "labels" && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-[192px] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-md p-2 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
                          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 px-2 py-1">Labels</div>
                          {["Research", "Design", "Development", "Testing", "Deployment"].map((lbl) => {
                            const isSelected = selectedLabels.includes(lbl);
                            return (
                              <button
                                key={lbl}
                                type="button"
                                onClick={() => {
                                  setSelectedLabels((prev) =>
                                    isSelected ? prev.filter((l) => l !== lbl) : [...prev, lbl]
                                  );
                                }}
                                className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors cursor-pointer text-left font-semibold"
                              >
                                <span>{lbl}</span>
                                {isSelected && <Check size={14} className="text-neutral-900 dark:text-neutral-100 stroke-[2.5]" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 6. Teams */}
                    <div className="relative flex items-center justify-between text-xs py-0.5 h-7">
                      <span className="text-neutral-600 dark:text-neutral-400 font-semibold">Teams</span>
                      <button
                        type="button"
                        onClick={() => setActivePopover(activePopover === "teams" ? null : "teams")}
                        className="flex items-center gap-1 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white font-semibold text-xs cursor-pointer"
                      >
                        <Users size={12} className="text-neutral-500 stroke-[2.2]" />
                        <span>{team || "Select team"}</span>
                      </button>

                      {/* Teams Popover */}
                      {activePopover === "teams" && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-[192px] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-md p-2 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
                          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 px-2 py-1">Team</div>
                          {["Engineering", "Product Design", "Marketing", "Sales"].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => {
                                setTeam(t);
                                setActivePopover(null);
                              }}
                              className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors cursor-pointer text-left font-semibold"
                            >
                              <span>{t}</span>
                              {team === t && <Check size={14} className="text-neutral-900 dark:text-neutral-100 stroke-[2.5]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 7. Reporter */}
                    <div className="relative flex items-center justify-between text-xs py-0.5 h-7">
                      <span className="text-neutral-600 dark:text-neutral-400 font-semibold">Reporter</span>
                      <button
                        type="button"
                        onClick={() => setActivePopover(activePopover === "reporter" ? null : "reporter")}
                        className="flex items-center gap-1 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white font-semibold text-xs cursor-pointer"
                      >
                        <User size={12} className="text-neutral-500 stroke-[2.2]" />
                        <span>{reporter || "Select reporter"}</span>
                      </button>

                      {/* Reporter Popover */}
                      {activePopover === "reporter" && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-[192px] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md shadow-md p-2 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
                          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 px-2 py-1">Reporter</div>
                          {["Dexter", "Ankit Datta", "Pooja Shree"].map((rep) => (
                            <button
                              key={rep}
                              type="button"
                              onClick={() => {
                                setReporter(rep);
                                setActivePopover(null);
                              }}
                              className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors cursor-pointer text-left font-semibold"
                            >
                              <span>{rep}</span>
                              {reporter === rep && <Check size={14} className="text-neutral-900 dark:text-neutral-100 stroke-[2.5]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Updates Card */}
                  <div className="border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#171717] p-3 flex flex-col gap-2 text-xs shadow-xs min-h-[96px]">
                    <div className="h-5 flex items-center gap-1 font-bold text-[#171717] dark:text-[#F5F5F5]">
                      <span>▾ Updates</span>
                    </div>
                    <div className="flex flex-col text-neutral-600 dark:text-neutral-300 text-xs">
                      {updatesList.length === 0 ? (
                        <div className="py-2 text-xs text-neutral-400 italic">No updates logged yet.</div>
                      ) : (
                        updatesList.map((upd) => (
                          <div key={upd.id} className="h-[44px] py-3 flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${upd.avatarColor} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
                              {upd.user[0]}
                            </div>
                            <span className="leading-tight truncate">
                              <span className="font-bold text-[#171717] dark:text-[#F5F5F5]">{upd.user} </span>
                              {upd.text}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TaskDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading...</div>}>
      <TaskDetailContent />
    </Suspense>
  );
}
