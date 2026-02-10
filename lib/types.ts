export type TaskStatus = "To Do" | "In Progress" | "Review" | "Done";
export type Priority = "Low" | "Medium" | "High";
export type EpicStatus = "Not Started" | "In Progress" | "Done" | "On Hold";
export type ProjectStatus = "Not Started" | "Active" | "On Hold" | "Done";
export type Role = "Admin" | "Manager" | "Member" | "Viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  role: Role;
}

export interface Comment {
  id: string;
  taskId: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  done: boolean;
  assignee?: User;
  dueDate?: string;
}

export interface Task {
  id: string;
  epicId: string;
  title: string;
  description: string;
  assignee: User | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  estimate?: number;
  subtasks: Subtask[];
  comments: Comment[];
}

export interface Epic {
  id: string;
  projectId: string;
  title: string;
  description: string;
  owner: User;
  status: EpicStatus;
  startDate?: string;
  endDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: User;
  status: ProjectStatus;
  memberIds: string[];
}
