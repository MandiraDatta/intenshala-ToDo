import { Project, FilterConfig } from "./types";
import {
  Circle,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Users,
  Calendar,
  Tag,
  User,
  Shield,
} from "lucide-react";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Design Homepage",
    priority: "High",
    members: [
      { id: "m1", name: "Dexter", avatar: "/Pasted image.png", initials: "D" },
      { id: "m2", name: "Ankit Datta", initials: "AD" },
    ],
    dueDate: "12 Sep 2026",
    status: "In Progress",
    teams: ["Design"],
    labels: ["Design", "UI"],
    reporter: "Dexter",
  },
  {
    id: "p2",
    name: "Develop Login Feature",
    priority: "Low",
    members: [
      { id: "m3", name: "John", initials: "J" },
    ],
    dueDate: "18 Sep 2026",
    status: "Planned",
    teams: ["Engineering"],
    labels: ["Feature", "Auth"],
    reporter: "John",
  },
  {
    id: "p3",
    name: "Test Payment Gateway",
    priority: "Medium",
    members: [
      { id: "m4", name: "Sarah", initials: "S" },
      { id: "m1", name: "Dexter", avatar: "/Pasted image.png", initials: "D" },
    ],
    dueDate: "25 Sep 2026",
    status: "Planned",
    teams: ["Engineering"],
    labels: ["Bug", "Testing"],
    reporter: "Sarah",
  },
  {
    id: "p4",
    name: "Security Audit",
    priority: "Urgent",
    members: [
      { id: "m2", name: "Ankit Datta", initials: "AD" },
    ],
    dueDate: "05 Oct 2026",
    status: "In Progress",
    teams: ["Engineering"],
    labels: ["Security"],
    reporter: "Dexter",
  },
  {
    id: "p5",
    name: "Marketing Campaign Launch",
    priority: "Medium",
    members: [
      { id: "m4", name: "Sarah", initials: "S" },
    ],
    dueDate: "10 Oct 2026",
    status: "Completed",
    teams: ["Marketing"],
    labels: ["Marketing"],
    reporter: "Sarah",
  },
];

export const FILTER_CONFIGS: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    icon: Circle,
    options: [
      { id: "Planned", label: "Planned", colorClass: "text-[#3B82F6]" },
      { id: "In Progress", label: "In Progress", colorClass: "text-[#EAB308]" },
      { id: "Completed", label: "Completed", colorClass: "text-[#10B981]" },
    ],
  },
  {
    key: "priority",
    label: "Priority",
    icon: Signal,
    options: [
      { id: "No Priority", label: "No Priority", icon: Signal, colorClass: "text-neutral-400" },
      { id: "Urgent", label: "Urgent", icon: SignalHigh, colorClass: "text-rose-600 font-semibold" },
      { id: "High", label: "High", icon: SignalHigh, colorClass: "text-rose-600 font-semibold" },
      { id: "Medium", label: "Medium", icon: SignalMedium, colorClass: "text-amber-600 font-semibold" },
      { id: "Low", label: "Low", icon: SignalLow, colorClass: "text-slate-500 font-semibold" },
    ],
  },
  {
    key: "members",
    label: "Members",
    icon: Users,
    options: [
      { id: "All Members", label: "All Members" },
    ],
  },
  {
    key: "dueDate",
    label: "Due Date",
    icon: Calendar,
    options: [
      { id: "No Due Date", label: "No Due Date" },
      { id: "Today", label: "Today" },
      { id: "Tomorrow", label: "Tomorrow" },
      { id: "This Week", label: "This Week" },
      { id: "Next Week", label: "Next Week" },
      { id: "Overdue", label: "Overdue" },
    ],
  },
  {
    key: "teams",
    label: "Teams",
    icon: Shield,
    options: [
      { id: "All Teams", label: "All Teams" },
      { id: "Design", label: "Design" },
      { id: "Engineering", label: "Engineering" },
      { id: "Marketing", label: "Marketing" },
    ],
  },
  {
    key: "labels",
    label: "Labels",
    icon: Tag,
    options: [
      { id: "All Labels", label: "All Labels" },
      { id: "Design", label: "Design" },
      { id: "Bug", label: "Bug" },
      { id: "Feature", label: "Feature" },
      { id: "Marketing", label: "Marketing" },
      { id: "UI", label: "UI" },
      { id: "Testing", label: "Testing" },
      { id: "Security", label: "Security" },
      { id: "Auth", label: "Auth" },
    ],
  },
  {
    key: "reporter",
    label: "Reporter",
    icon: User,
    options: [
      { id: "All Reporters", label: "All Reporters" },
    ],
  },
];
