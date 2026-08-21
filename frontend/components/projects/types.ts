export type PriorityType = "Urgent" | "High" | "Medium" | "Low" | "No Priority";
export type StatusType = "Planned" | "In Progress" | "Completed";

export interface ProjectMember {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  /** 'project' = directly added; 'task' = added via a task assignment */
  source?: 'project' | 'task';
}

export interface Project {
  id: string;
  name: string;
  priority: PriorityType;
  members: ProjectMember[];
  dueDate: string;
  status: StatusType;
  teams: string[];
  labels: string[];
  reporter: string;
}

export interface VisibleFields {
  project: boolean;
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  status: boolean;
  teams: boolean;
  labels: boolean;
  reporter: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string; size?: number; weight?: string }>;
  colorClass?: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number; weight?: string }>;
  options: FilterOption[];
}

export type ActiveFilters = Record<string, string>;
