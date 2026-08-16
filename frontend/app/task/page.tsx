"use client";

import Sidebar from "@/components/sidebar";
import {
  PanelLeft,
  ChevronRight,
  Lock,
  MessageSquare,
  Share2,
  LayoutGrid,
  Calendar as CalendarIcon,
  Plus,
  ChevronDown,
  ChevronLeft,
  Paperclip,
  Send,
  UserPlus,
  Settings,
  SignalHigh,
  SignalMedium,
  SignalLow,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TaskDetailPage() {
  const [subtasksOpen, setSubtasksOpen] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [selectedDate, setSelectedDate] = useState<number>(10);

  const subtasks = [
    { id: "st1", title: "API Specs Drafted", priority: "High", members: "A", dueDate: "29 Jul" },
    { id: "st2", title: "Endpoints Documented", priority: "Medium", members: "D", dueDate: "30 Jul" },
    { id: "st3", title: "Review & Testing", priority: "Low", members: "QA", dueDate: "31 Jul" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex text-[#171717] dark:text-[#F5F5F5] font-sans transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-200 relative z-0">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-[#E5E5E5] dark:border-[#2A2A2A] px-6 flex items-center justify-between bg-white dark:bg-[#111111] shrink-0 transition-colors duration-200">
          {/* Left: Breadcrumbs / Sidebar toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-md text-[#525252] dark:text-[#A3A3A3] transition-colors"
              title="Back to Dashboard"
            >
              <PanelLeft size={18} />
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3]">
              <Link href="/dashboard" className="hover:text-[#171717] dark:hover:text-[#F5F5F5]">Tasks</Link>
              <ChevronRight size={12} />
              <span className="text-[#171717] dark:text-[#F5F5F5] font-medium">Write API Documentation</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-md text-[#525252] dark:text-[#A3A3A3] transition-colors cursor-pointer"
              title="Lock Task"
            >
              <Lock size={16} />
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-md text-[#525252] dark:text-[#A3A3A3] text-xs font-medium transition-colors cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>1</span>
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-md text-[#525252] dark:text-[#A3A3A3] transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 size={16} />
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-md text-[#525252] dark:text-[#A3A3A3] transition-colors cursor-pointer"
              title="More Options"
            >
              <MoreHorizontal size={18} />
            </button>
            <div className="w-px h-4 bg-[#E5E5E5] dark:bg-[#2A2A2A] mx-1" />
            <button
              type="button"
              className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-md text-[#525252] dark:text-[#A3A3A3] transition-colors cursor-pointer"
              title="Split View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </header>

        {/* Task Content Body */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Main Details Column */}
            <div className="flex-1 min-w-0 w-full space-y-6">
              {/* Task Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#171717] dark:text-[#F5F5F5] tracking-tight">
                  Write API Documentation
                </h1>
                <p className="text-sm text-[#525252] dark:text-[#A3A3A3] mt-2 leading-relaxed max-w-2xl">
                  Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.
                </p>
              </div>

              {/* Task Properties Badges */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-[#737373] dark:text-[#A3A3A3] w-20 font-medium">Properties</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                    <div className="w-4 h-4 rounded-full bg-[#EC4899] flex items-center justify-center text-[9px] text-white font-bold">
                      D
                    </div>
                    <span>Designer</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1F2] dark:bg-rose-950/40 border border-[#FECDD3] dark:border-rose-900/50 text-xs font-medium text-[#E11D48] dark:text-rose-400">
                    <CalendarIcon size={12} />
                    <span>31 Jul</span>
                  </div>
                </div>
              </div>

              {/* Labels Section */}
              <div className="flex items-start gap-3 pt-1">
                <span className="text-xs text-[#737373] dark:text-[#A3A3A3] w-20 font-medium pt-1">Labels</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["Research", "Design", "Development", "Testing", "Deployment"].map((label) => (
                    <span
                      key={label}
                      className="px-2.5 py-1 rounded-full bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs text-[#525252] dark:text-[#A3A3A3] font-medium"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources Section */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-[#737373] dark:text-[#A3A3A3] w-20 font-medium">Resources</span>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-dashed border-[#CBD5E1] dark:border-[#2A2A2A] text-xs text-[#737373] dark:text-[#A3A3A3] hover:bg-[#F8FAFC] dark:hover:bg-[#262626] transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Add document or link...</span>
                </button>
              </div>

              <div className="w-full h-px bg-[#E5E5E5] dark:bg-[#2A2A2A] my-4" />

              {/* Subtasks Collapsible Table */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSubtasksOpen(!subtasksOpen)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#171717] dark:text-[#F5F5F5] cursor-pointer select-none"
                >
                  {subtasksOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>Subtasks</span>
                </button>

                {subtasksOpen && (
                  <div className="w-full overflow-x-auto border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#171717]">
                    <div className="min-w-[34rem] flex flex-col">
                      {/* Subtasks Header */}
                      <div className="w-full h-9 flex items-center px-4 bg-[#F9F9F9] dark:bg-[#111111] border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] font-medium text-[#737373] dark:text-[#A3A3A3]">
                        <div className="w-1/3 text-[#171717] dark:text-[#F5F5F5]">Task</div>
                        <div className="flex-1 grid grid-cols-4 text-[#171717] dark:text-[#F5F5F5] items-center gap-2">
                          <div>Priority</div>
                          <div>Members</div>
                          <div>Due Date</div>
                          <div className="text-end">Actions</div>
                        </div>
                      </div>

                      {/* Subtask Rows */}
                      {subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="w-full h-10 flex items-center px-4 border-b border-[#F0F0F0] dark:border-[#2A2A2A] hover:bg-[#F9F9F9] dark:hover:bg-[#262626] text-xs text-[#171717] dark:text-[#F5F5F5]"
                        >
                          <div className="w-1/3 font-medium truncate pr-2">{subtask.title}</div>
                          <div className="flex-1 grid grid-cols-4 items-center gap-2">
                            <div>
                              {subtask.priority === "High" ? (
                                <span className="flex items-center gap-1 text-[11px] text-[#EF4444] dark:text-red-400 font-medium">
                                  <SignalHigh size={12} /> High
                                </span>
                              ) : subtask.priority === "Medium" ? (
                                <span className="flex items-center gap-1 text-[11px] text-[#F97316] dark:text-orange-400 font-medium">
                                  <SignalMedium size={12} /> Medium
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[11px] text-[#94A3B8] dark:text-slate-400 font-medium">
                                  <SignalLow size={12} /> Low
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-neutral-200">
                                {subtask.members}
                              </div>
                            </div>
                            <div className="text-[11px] text-[#525252] dark:text-[#A3A3A3]">{subtask.dueDate}</div>
                            <div className="flex justify-end">
                              <button type="button" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5]">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Subtask Button */}
                      <div className="px-4 py-2 bg-white dark:bg-[#171717]">
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-xs text-[#171717] dark:text-[#F5F5F5] font-medium hover:underline cursor-pointer"
                        >
                          <Plus size={13} />
                          <span>Add Subtasks</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity & Comments Section */}
              <div className="space-y-4 pt-4">
                <span className="text-xs font-bold text-[#171717] dark:text-[#F5F5F5]">Subtasks & Activity</span>

                {/* Existing Comment */}
                <div className="flex items-start gap-3 bg-[#FAFAFA] dark:bg-[#171717] p-3 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#171717] dark:text-[#F5F5F5]">Ankit Datta</span>
                      <span className="text-[10px] text-[#A3A3A3] dark:text-[#737373]">just now</span>
                    </div>
                    <p className="text-xs text-[#404040] dark:text-[#A3A3A3] mt-1">dsds</p>
                  </div>
                  <button type="button" className="text-[#A3A3A3] dark:text-[#737373] hover:text-[#171717] dark:hover:text-[#F5F5F5]">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* Reply Input */}
                <div className="flex items-center gap-2 border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg p-2 bg-white dark:bg-[#171717]">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    D
                  </div>
                  <input
                    type="text"
                    placeholder="Leave a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 text-xs outline-none bg-transparent text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] dark:placeholder:text-[#737373]"
                  />
                  <button type="button" className="text-[#A3A3A3] dark:text-[#737373] hover:text-[#171717] dark:hover:text-[#F5F5F5] p-1">
                    <Paperclip size={14} />
                  </button>
                  <button type="button" className="text-[#171717] dark:text-[#F5F5F5] hover:text-black dark:hover:text-white p-1">
                    <Send size={14} />
                  </button>
                </div>

                {/* Bottom Add Comment */}
                <div className="flex items-center gap-2 border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg p-2.5 bg-white dark:bg-[#171717] shadow-xs">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 text-xs outline-none bg-transparent text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] dark:placeholder:text-[#737373]"
                  />
                  <button type="button" className="text-[#A3A3A3] dark:text-[#737373] hover:text-[#171717] dark:hover:text-[#F5F5F5] p-1">
                    <Paperclip size={14} />
                  </button>
                  <button type="button" className="text-[#171717] dark:text-[#F5F5F5] hover:text-black dark:hover:text-white p-1">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Details Sidebar Panel */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#171717] p-4 shadow-xs space-y-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
                <div className="flex items-center gap-1 text-xs font-bold text-[#171717] dark:text-[#F5F5F5]">
                  <span>- Details</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] p-1">
                    <Plus size={14} />
                  </button>
                  <button type="button" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] p-1">
                    <Settings size={14} />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#737373] dark:text-[#A3A3A3] font-medium">Status</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF7ED] dark:bg-orange-950/40 border border-[#FFEDD5] dark:border-orange-900/50 text-[#EA580C] dark:text-orange-400 font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] dark:bg-orange-400" />
                  <span>Backlog</span>
                </div>
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#737373] dark:text-[#A3A3A3] font-medium">Priority</span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[#EF4444] dark:text-red-400 font-semibold text-[11px]">
                  <SignalHigh size={12} />
                  <span>High</span>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#737373] dark:text-[#A3A3A3] font-medium">Members</span>
                <button type="button" className="flex items-center gap-1 text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] text-[11px] font-medium cursor-pointer">
                  <UserPlus size={12} />
                  <span>Add members</span>
                </button>
              </div>

              {/* Dates Input */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#737373] dark:text-[#A3A3A3] font-medium">Dates</span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[11px] text-[#171717] dark:text-[#F5F5F5]">
                  <span className="font-medium">Jan 10</span>
                  <span>-&gt;</span>
                  <span className="text-[#A3A3A3] dark:text-[#737373]">End</span>
                </div>
              </div>

              {/* Date Picker Popover Widget */}
              <div className="border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-3 bg-white dark:bg-[#171717] shadow-sm space-y-2 mt-4">
                {/* Month Navigator */}
                <div className="flex items-center justify-between text-xs font-semibold text-[#171717] dark:text-[#F5F5F5] px-1">
                  <button type="button" className="p-1 text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5]">
                    <ChevronLeft size={14} />
                  </button>
                  <span>January 2026</span>
                  <button type="button" className="p-1 text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5]">
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 text-center text-[10px] text-[#A3A3A3] dark:text-[#737373] font-medium pt-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 text-center text-xs font-medium gap-y-1 relative">
                  {[30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3].map((d, index) => {
                    const isOtherMonth = index === 0 || index > 31;
                    const isSelected = index === 10; // Day 10

                    return (
                      <div key={index} className="flex flex-col items-center justify-center relative py-1">
                        <button
                          type="button"
                          onClick={() => setSelectedDate(d)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#171717] dark:bg-[#F5F5F5] text-white dark:text-black font-bold"
                              : isOtherMonth
                              ? "text-[#CBD5E1] dark:text-[#404040]"
                              : "text-[#171717] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#262626]"
                          }`}
                        >
                          {d}
                        </button>

                        {/* Active user badge indicator on day 10 */}
                        {isSelected && (
                          <div className="absolute top-7 z-20 whitespace-nowrap bg-[#22C55E] text-white font-semibold text-[9px] px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                            <span>Pooja Shree</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Metadata note */}
                <div className="pt-5 border-t border-[#F0F0F0] dark:border-[#2A2A2A] text-[10px] text-[#A3A3A3] dark:text-[#737373] text-center">
                  posted an update · Aug 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
