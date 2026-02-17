export type Priority = "low" | "medium" | "high" | "critical";
export type Status = "open" | "in-progress" | "completed";
export type Category =
  | "Plumbing"
  | "Electrical"
  | "HVAC"
  | "Escalators & Elevators"
  | "Fire Safety"
  | "General";

export interface MaintenanceRequest {
  id: string;
  title: string;
  category: Category | string;
  priority: Priority;
  status: Status;
  location: string;
  assignee: string;
  createdAt: string;
  description: string;
}

export interface MaintenanceStats {
  open: number;
  inProgress: number;
  completed: number;
  overdue: number;
}
