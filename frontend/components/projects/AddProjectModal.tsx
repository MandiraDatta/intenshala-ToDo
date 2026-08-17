"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Project, PriorityType, StatusType } from "./types";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProject: Project) => void;
  initialStatus?: StatusType;
}

export default function AddProjectModal({
  isOpen,
  onClose,
  onSave,
  initialStatus = "Planned",
}: AddProjectModalProps) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<PriorityType>("High");
  const [status, setStatus] = useState<StatusType>(initialStatus);
  const [memberNames, setMemberNames] = useState("Dexter");
  const [dueDate, setDueDate] = useState("30 Sep 2026");
  const [team, setTeam] = useState("Engineering");
  const [labels, setLabels] = useState("Feature");
  const [reporter, setReporter] = useState("Dexter");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedMembers = memberNames
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((mem, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        name: mem,
        initials: mem
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        ...(mem.toLowerCase() === "dexter" ? { avatar: "/Pasted image.png" } : {}),
      }));

    const parsedLabels = labels
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      priority,
      status,
      members: parsedMembers.length > 0 ? parsedMembers : [{ id: "m1", name: "Dexter", initials: "D", avatar: "/Pasted image.png" }],
      dueDate: dueDate.trim() || "30 Sep 2026",
      teams: team ? [team] : ["Engineering"],
      labels: parsedLabels.length > 0 ? parsedLabels : ["Feature"],
      reporter: reporter.trim() || "Dexter",
    };

    onSave(newProject);
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#171717] rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-2xl w-full max-w-md p-5 flex flex-col gap-4 transition-colors animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F5F5F5]">
            Create New Project
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors p-1"
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
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. 15 Oct 2026"
                className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] rounded-md focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
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
                <option value="Design">Design</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          {/* Members & Reporter */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                Members (comma separated)
              </label>
              <input
                type="text"
                value={memberNames}
                onChange={(e) => setMemberNames(e.target.value)}
                placeholder="Dexter, John"
                className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] rounded-md focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                Reporter
              </label>
              <input
                type="text"
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
                placeholder="Dexter"
                className="w-full px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#F5F5F5] placeholder:text-[#A3A3A3] rounded-md focus:outline-none focus:border-[#171717] dark:focus:border-[#A3A3A3]"
              />
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
              placeholder="Design, UI, Feature"
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
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}
