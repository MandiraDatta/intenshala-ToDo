"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import {
  Lock,
  Share2,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Paperclip,
  Send,
  PanelLeft,
  ChevronLeft,
  Settings,
  UserPlus,
  Tag,
  FileText,
  MessageSquare,
  LayoutGrid,
  SignalLow,
  SignalMedium,
  SignalHigh,
} from "lucide-react";
import { RiMoreFill } from "@remixicon/react";

export default function TaskDetailPage() {
  const [subtasksOpen, setSubtasksOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<number>(10);
  const [replyText, setReplyText] = useState("");
  const [commentText, setCommentText] = useState("");

  const subtasks = [
    {
      id: "sub-1",
      title: "Subtask 1",
      priority: "High",
      members: "A",
      dueDate: "12 Sep 2026",
    },
    {
      id: "sub-2",
      title: "Subtask 2",
      priority: "Low",
      members: "CN",
      dueDate: "15 Sep 2026",
    },
    {
      id: "sub-3",
      title: "Subtask 3",
      priority: "Medium",
      members: "+",
      dueDate: "18 Sep 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex text-[#171717] font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-white">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-[#E5E5E5] px-6 flex items-center justify-between bg-white shrink-0">
          {/* Left: Breadcrumbs / Sidebar toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 hover:bg-[#F5F5F5] rounded-md text-[#525252] transition-colors"
              title="Back to Dashboard"
            >
              <PanelLeft size={18} />
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-[#737373]">
              <Link href="/dashboard" className="hover:text-[#171717]">Tasks</Link>
              <ChevronRight size={12} />
              <span className="text-[#171717] font-medium">Write API Documentation</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 hover:bg-[#F5F5F5] rounded-md text-[#525252] transition-colors cursor-pointer"
              title="Lock Task"
            >
              <Lock size={16} />
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 hover:bg-[#F5F5F5] rounded-md text-[#525252] text-xs font-medium transition-colors cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>1</span>
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-[#F5F5F5] rounded-md text-[#525252] transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 size={16} />
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-[#F5F5F5] rounded-md text-[#525252] transition-colors cursor-pointer"
              title="More Options"
            >
              <RiMoreFill size={18} />
            </button>
            <div className="w-px h-4 bg-[#E5E5E5] mx-1" />
            <button
              type="button"
              className="p-1.5 hover:bg-[#F5F5F5] rounded-md text-[#525252] transition-colors cursor-pointer"
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
                <h1 className="text-2xl md:text-3xl font-bold text-[#171717] tracking-tight">
                  Write API Documentation
                </h1>
                <p className="text-sm text-[#525252] mt-2 leading-relaxed max-w-2xl">
                  Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.
                </p>
              </div>

              {/* Task Properties Badges */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-[#737373] w-20 font-medium">Properties</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-xs font-medium text-[#171717]">
                    <div className="w-4 h-4 rounded-full bg-[#EC4899] flex items-center justify-center text-[9px] text-white font-bold">
                      D
                    </div>
                    <span>Designer</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-xs font-medium text-[#E11D48]">
                    <CalendarIcon size={12} />
                    <span>31 Jul</span>
                  </div>
                </div>
              </div>

              {/* Labels Section */}
              <div className="flex items-start gap-3 pt-1">
                <span className="text-xs text-[#737373] w-20 font-medium pt-1">Labels</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["Research", "Design", "Development", "Testing", "Deployment"].map((label) => (
                    <span
                      key={label}
                      className="px-2.5 py-1 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-xs text-[#525252] font-medium"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources Section */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-[#737373] w-20 font-medium">Resources</span>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-dashed border-[#CBD5E1] text-xs text-[#737373] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Add document or link...</span>
                </button>
              </div>

              <div className="w-full h-px bg-[#E5E5E5] my-4" />

              {/* Subtasks Collapsible Table */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSubtasksOpen(!subtasksOpen)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#171717] cursor-pointer select-none"
                >
                  {subtasksOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>Subtasks</span>
                </button>

                {subtasksOpen && (
                  <div className="w-full overflow-x-auto border border-[#E5E5E5] rounded-md bg-white">
                    <div className="min-w-[34rem] flex flex-col">
                      {/* Subtasks Header */}
                      <div className="w-full h-9 flex items-center px-4 bg-[#F9F9F9] border-b border-[#E5E5E5] text-[11px] font-medium text-[#737373]">
                        <div className="w-1/3 text-[#171717]">Task</div>
                        <div className="flex-1 grid grid-cols-4 text-[#171717] items-center gap-2">
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
                          className="w-full h-10 flex items-center px-4 border-b border-[#F0F0F0] hover:bg-[#F9F9F9] text-xs text-[#171717]"
                        >
                          <div className="w-1/3 font-medium truncate pr-2">{subtask.title}</div>
                          <div className="flex-1 grid grid-cols-4 items-center gap-2">
                            <div>
                              {subtask.priority === "High" ? (
                                <span className="flex items-center gap-1 text-[11px] text-[#EF4444] font-medium">
                                  <SignalHigh size={12} /> High
                                </span>
                              ) : subtask.priority === "Medium" ? (
                                <span className="flex items-center gap-1 text-[11px] text-[#F97316] font-medium">
                                  <SignalMedium size={12} /> Medium
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[11px] text-[#94A3B8] font-medium">
                                  <SignalLow size={12} /> Low
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                                {subtask.members}
                              </div>
                            </div>
                            <div className="text-[11px] text-[#525252]">{subtask.dueDate}</div>
                            <div className="flex justify-end">
                              <button type="button" className="text-[#737373] hover:text-[#171717]">
                                <RiMoreFill size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Subtask Button */}
                      <div className="px-4 py-2 bg-white">
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-xs text-[#171717] font-medium hover:underline cursor-pointer"
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
                <span className="text-xs font-bold text-[#171717]">Subtasks & Activity</span>

                {/* Existing Comment */}
                <div className="flex items-start gap-3 bg-[#FAFAFA] p-3 rounded-lg border border-[#E5E5E5]">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#171717]">Ankit Datta</span>
                      <span className="text-[10px] text-[#A3A3A3]">just now</span>
                    </div>
                    <p className="text-xs text-[#404040] mt-1">dsds</p>
                  </div>
                  <button type="button" className="text-[#A3A3A3] hover:text-[#171717]">
                    <RiMoreFill size={16} />
                  </button>
                </div>

                {/* Reply Input */}
                <div className="flex items-center gap-2 border border-[#E5E5E5] rounded-lg p-2 bg-white">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    D
                  </div>
                  <input
                    type="text"
                    placeholder="Leave a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 text-xs outline-none bg-transparent text-[#171717] placeholder:text-[#A3A3A3]"
                  />
                  <button type="button" className="text-[#A3A3A3] hover:text-[#171717] p-1">
                    <Paperclip size={14} />
                  </button>
                  <button type="button" className="text-[#171717] hover:text-black p-1">
                    <Send size={14} />
                  </button>
                </div>

                {/* Bottom Add Comment */}
                <div className="flex items-center gap-2 border border-[#E5E5E5] rounded-lg p-2.5 bg-white shadow-xs">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 text-xs outline-none bg-transparent text-[#171717] placeholder:text-[#A3A3A3]"
                  />
                  <button type="button" className="text-[#A3A3A3] hover:text-[#171717] p-1">
                    <Paperclip size={14} />
                  </button>
                  <button type="button" className="text-[#171717] hover:text-black p-1">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Details Sidebar Panel */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 border border-[#E5E5E5] rounded-xl bg-white p-4 shadow-xs space-y-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                <div className="flex items-center gap-1 text-xs font-bold text-[#171717]">
                  <span>- Details</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="text-[#737373] hover:text-[#171717] p-1">
                    <Plus size={14} />
                  </button>
                  <button type="button" className="text-[#737373] hover:text-[#171717] p-1">
                    <Settings size={14} />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#737373] font-medium">Status</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-[#EA580C] font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                  <span>Backlog</span>
                </div>
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#737373] font-medium">Priority</span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[#EF4444] font-semibold text-[11px]">
                  <SignalHigh size={12} />
                  <span>High</span>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#737373] font-medium">Members</span>
                <button type="button" className="flex items-center gap-1 text-[#737373] hover:text-[#171717] text-[11px] font-medium cursor-pointer">
                  <UserPlus size={12} />
                  <span>Add members</span>
                </button>
              </div>

              {/* Dates Input */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#737373] font-medium">Dates</span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#FAFAFA] border border-[#E5E5E5] text-[11px] text-[#171717]">
                  <span className="font-medium">Jan 10</span>
                  <span>-&gt;</span>
                  <span className="text-[#A3A3A3]">End</span>
                </div>
              </div>

              {/* Date Picker Popover Widget */}
              <div className="border border-[#E5E5E5] rounded-xl p-3 bg-white shadow-sm space-y-2 mt-4">
                {/* Month Navigator */}
                <div className="flex items-center justify-between text-xs font-semibold text-[#171717] px-1">
                  <button type="button" className="p-1 text-[#737373] hover:text-[#171717]">
                    <ChevronLeft size={14} />
                  </button>
                  <span>January 2026</span>
                  <button type="button" className="p-1 text-[#737373] hover:text-[#171717]">
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 text-center text-[10px] text-[#A3A3A3] font-medium pt-1">
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
                              ? "bg-[#171717] text-white font-bold"
                              : isOtherMonth
                              ? "text-[#CBD5E1]"
                              : "text-[#171717] hover:bg-[#F5F5F5]"
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
                <div className="pt-5 border-t border-[#F0F0F0] text-[10px] text-[#A3A3A3] text-center">
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
