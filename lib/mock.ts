import { generateComprehensiveTasks } from "./mock-data";
import { Epic, Subtask, Task, User } from "./types";

// ─── Users ────────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@tracker.dev",
    initials: "AU",
    avatarColor: "#6366f1",
    role: "Admin",
    weeklyCapacity: 40,
  },
  {
    id: "u2",
    name: "Operations Manager",
    email: "manager@tracker.dev",
    initials: "OM",
    avatarColor: "#3b82f6",
    role: "Manager",
    weeklyCapacity: 40,
  },
  {
    id: "u3",
    name: "Frontend Dev",
    email: "dev1@tracker.dev",
    initials: "FD",
    avatarColor: "#10b981",
    role: "Member",
    weeklyCapacity: 40,
  },
  {
    id: "u4",
    name: "Backend Dev",
    email: "dev2@tracker.dev",
    initials: "BD",
    avatarColor: "#f59e0b",
    role: "Member",
    weeklyCapacity: 40,
  },
  {
    id: "u5",
    name: "UI Designer",
    email: "designer@tracker.dev",
    initials: "UD",
    avatarColor: "#ec4899",
    role: "Member",
    weeklyCapacity: 32,
  },
  {
    id: "u6",
    name: "Stakeholder",
    email: "viewer@tracker.dev",
    initials: "SH",
    avatarColor: "#64748b",
    role: "Viewer",
    weeklyCapacity: 0,
  },
];

// Kept for places that need a default fallback; components should prefer useAuth()
export const CURRENT_USER: User = USERS[0];

// Explicit epic memberships (relevant for Member-role access gating)
export const EPIC_MEMBERS: Record<string, string[]> = {
  e1: ["u1", "u2", "u3", "u4", "u5", "u6"], // All users
  e2: ["u1", "u2", "u3", "u4", "u5"], // All except viewer
  e3: ["u1", "u2", "u3", "u5"], // Frontend + Designer + Admin/Manager
  e4: ["u1", "u2", "u4"], // Backend focused
  e5: ["u1", "u2", "u3", "u4", "u5"], // Full team
  e6: ["u1", "u2", "u6"], // Minimal visibility
};

// ─── Epics ────────────────────────────────────────────────────────────────────

export const EPICS: Epic[] = [
  {
    id: "e1",
    title: "E-Commerce Platform Redesign",
    description:
      "Complete UI/UX overhaul of the customer-facing e-commerce platform. Includes responsive design, checkout flow optimization, and accessibility improvements.",
    owner: USERS[0], // Admin
    watchers: [USERS[1], USERS[2]], // Manager, Frontend Dev
    status: "In Progress",
    startDate: "2026-01-15",
    endDate: "2026-03-15",
    memberIds: ["u1", "u2", "u3", "u4", "u5", "u6"],
  },
  {
    id: "e2",
    title: "Payment Gateway Integration",
    description:
      "Integrate Stripe and PayPal payment processing with fraud detection, recurring billing support, and multi-currency handling.",
    owner: USERS[3], // Backend Dev
    watchers: [USERS[0], USERS[1]], // Admin, Manager
    status: "In Progress",
    startDate: "2026-02-01",
    endDate: "2026-02-28",
    memberIds: ["u1", "u2", "u3", "u4", "u5"],
  },
  {
    id: "e3",
    title: "Mobile App MVP",
    description:
      "Native iOS and Android apps with core features: product browsing, wishlist, push notifications, and quick checkout.",
    owner: USERS[2], // Frontend Dev
    watchers: [USERS[0], USERS[4]], // Admin, Designer
    status: "Not Started",
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    memberIds: ["u1", "u2", "u3", "u5"],
  },
  {
    id: "e4",
    title: "Analytics & Reporting System",
    description:
      "Real-time analytics dashboard for sales, user behavior, conversion tracking, and automated reporting exports.",
    owner: USERS[0], // Admin
    watchers: [USERS[1], USERS[3]], // Manager, Backend Dev
    status: "In Progress",
    startDate: "2026-01-20",
    endDate: "2026-02-25",
    memberIds: ["u1", "u2", "u4"],
  },
  {
    id: "e5",
    title: "Customer Support Portal",
    description:
      "Self-service portal with ticket system, live chat integration, knowledge base, and order tracking.",
    owner: USERS[4], // Designer
    watchers: [USERS[0], USERS[2]], // Admin, Frontend Dev
    status: "On Hold",
    startDate: "2026-02-10",
    endDate: "2026-03-20",
    memberIds: ["u1", "u2", "u3", "u4", "u5"],
  },
  {
    id: "e6",
    title: "Infrastructure Migration",
    description:
      "Migrate from AWS EC2 to Kubernetes cluster with auto-scaling, improved monitoring, and disaster recovery setup.",
    owner: USERS[3], // Backend Dev
    watchers: [USERS[0]], // Admin only
    status: "Done",
    startDate: "2025-12-01",
    endDate: "2026-01-31",
    memberIds: ["u1", "u2", "u6"],
  },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const TASKS: Task[] = generateComprehensiveTasks(USERS);

// ─── Rollup helpers ───────────────────────────────────────────────────────────

export function getTaskProgress(task: Task): number {
  if (task.subtasks.length === 0) {
    if (task.status === "Done") return 100;
    if (task.status === "In Progress" || task.status === "Review") return 50;
    return 0;
  }
  const done = task.subtasks.filter((s) => s.done).length;
  return Math.round((done / task.subtasks.length) * 100);
}

export function getTasksByEpic(epicId: string): Task[] {
  return TASKS.filter((t) => t.epicId === epicId);
}

export function getTaskById(taskId: string): Task | undefined {
  return TASKS.find((t) => t.id === taskId);
}

export function getEpicById(epicId: string): Epic | undefined {
  return EPICS.find((e) => e.id === epicId);
}

export function getEpicForTask(taskId: string): Epic | undefined {
  const task = getTaskById(taskId);
  if (!task) return undefined;
  return EPICS.find((e) => e.id === task.epicId);
}

export function getMyTasks(userId: string): Task[] {
  return TASKS.filter((t) => t.assignee?.id === userId);
}

export function getMySubtasks(userId: string): Subtask[] {
  return TASKS.flatMap((t) => t.subtasks).filter(
    (s) => s.assignee?.id === userId,
  );
}

export function getEpicProgress(epicId: string): number {
  const epicTasks = TASKS.filter((t) => t.epicId === epicId);
  if (epicTasks.length === 0) return 0;
  const total = epicTasks.reduce((sum, t) => sum + getTaskProgress(t), 0);
  return Math.round(total / epicTasks.length);
}

export function getEpicHealthIndicators(epicId: string): {
  overdueCount: number;
  atRiskCount: number;
} {
  const epicTasks = TASKS.filter((t) => t.epicId === epicId);

  // Mock health indicators (in real app would calculate from dates/progress)
  const overdueCount = epicTasks.filter((t) => {
    const due = new Date(t.dueDate);
    const now = new Date("2026-02-10");
    return due < now && t.status !== "Done";
  }).length;

  const atRiskCount = epicTasks.filter((t) => {
    return t.status === "In Progress" && t.priority === "High";
  }).length;

  return { overdueCount, atRiskCount };
}
