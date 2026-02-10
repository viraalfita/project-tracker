import { Comment, Epic, Project, Subtask, Task, User } from "./types";

// ─── Users ────────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@alpha.dev",
    initials: "AJ",
    avatarColor: "#6366f1",
    role: "Admin",
  },
  {
    id: "u2",
    name: "Bob Martinez",
    email: "bob@alpha.dev",
    initials: "BM",
    avatarColor: "#10b981",
    role: "Manager",
  },
  {
    id: "u3",
    name: "Carol Davis",
    email: "carol@alpha.dev",
    initials: "CD",
    avatarColor: "#f59e0b",
    role: "Member",
  },
  {
    id: "u4",
    name: "Dan Lee",
    email: "dan@alpha.dev",
    initials: "DL",
    avatarColor: "#ef4444",
    role: "Viewer",
  },
];

// Kept for places that need a default fallback; components should prefer useAuth()
export const CURRENT_USER: User = USERS[0];

// Explicit project memberships (relevant for Member-role access gating)
export const PROJECT_MEMBERS: Record<string, string[]> = {
  p1: ["u1", "u2", "u3", "u4"],
  p2: ["u1", "u2", "u3"],
  p3: ["u1", "u2"],
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Project Alpha",
    description: "Internal project tracker MVP — replace ClickUp + Notion.",
    owner: USERS[0],
    status: "Active",
    memberIds: ["u1", "u2", "u3", "u4"],
  },
  {
    id: "p2",
    name: "Customer Portal v2",
    description:
      "Redesign and rebuild the customer-facing portal with modern UX.",
    owner: USERS[1],
    status: "Active",
    memberIds: ["u1", "u2", "u3"],
  },
  {
    id: "p3",
    name: "Mobile App Beta",
    description: "Native mobile app for iOS and Android.",
    owner: USERS[0],
    status: "Not Started",
    memberIds: ["u1", "u2"],
  },
];

// Legacy single project constant (for backwards compatibility)
export const PROJECT: Project = PROJECTS[0];

// ─── Epics ────────────────────────────────────────────────────────────────────

export const EPICS: Epic[] = [
  {
    id: "e1",
    projectId: "p1",
    title: "Authentication Overhaul",
    description:
      "Redesign the entire auth flow — login, registration, password reset — to match the new design system and support future SSO.",
    owner: USERS[0],
    status: "In Progress",
    startDate: "2026-02-01",
    endDate: "2026-02-28",
  },
  {
    id: "e2",
    projectId: "p1",
    title: "Reporting Dashboard",
    description:
      "Build the management dashboard with KPI rollups, EWS feed, utilization charts, and drill-down views for oversight.",
    owner: USERS[1],
    status: "Not Started",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
  },
];

// ─── Comments ─────────────────────────────────────────────────────────────────

const commentsT1: Comment[] = [
  {
    id: "c1",
    taskId: "t1",
    author: USERS[0],
    text: "Figma link is in the description. Mobile breakpoints are the priority.",
    createdAt: "2026-02-08 09:14",
  },
  {
    id: "c2",
    taskId: "t1",
    author: USERS[1],
    text: "Looks great so far — just the responsive pass left. Assigning Dan to review.",
    createdAt: "2026-02-09 14:32",
  },
];

const commentsT2: Comment[] = [
  {
    id: "c3",
    taskId: "t2",
    author: USERS[1],
    text: "Google OAuth creds are in 1Password under 'Alpha OAuth'. Ping me if blocked.",
    createdAt: "2026-02-07 11:00",
  },
];

const commentsT3: Comment[] = [
  {
    id: "c4",
    taskId: "t3",
    author: USERS[2],
    text: "zxcvbn is already in the lockfile from a previous attempt — just re-enable it.",
    createdAt: "2026-02-06 16:45",
  },
];

const commentsT4: Comment[] = [
  {
    id: "c5",
    taskId: "t4",
    author: USERS[0],
    text: "Token expiry should be configurable via env var, not hardcoded.",
    createdAt: "2026-02-05 10:20",
  },
  {
    id: "c6",
    taskId: "t4",
    author: USERS[3],
    text: "Confirmed. Using NEXT_PUBLIC_SESSION_DURATION for now.",
    createdAt: "2026-02-05 10:55",
  },
];

const commentsT5: Comment[] = [
  {
    id: "c7",
    taskId: "t5",
    author: USERS[2],
    text: "Spec for the KPI cards is in the Docs tab on the Reporting Dashboard epic.",
    createdAt: "2026-02-10 08:30",
  },
];

// ─── Subtasks ─────────────────────────────────────────────────────────────────

const subtasksT1: Subtask[] = [
  {
    id: "s1",
    taskId: "t1",
    title: "Write semantic HTML structure",
    done: true,
    assignee: USERS[0],
  },
  {
    id: "s2",
    taskId: "t1",
    title: "Apply Tailwind styles per Figma",
    done: true,
    assignee: USERS[0],
  },
  {
    id: "s3",
    taskId: "t1",
    title: "Mobile responsive pass (≤768px)",
    done: false,
    assignee: USERS[3],
  },
  {
    id: "s4",
    taskId: "t1",
    title: "Accessibility audit (WCAG AA)",
    done: false,
    assignee: USERS[3],
  },
];

const subtasksT2: Subtask[] = [
  {
    id: "s5",
    taskId: "t2",
    title: "Register Google OAuth app in Cloud Console",
    done: true,
    assignee: USERS[1],
  },
  {
    id: "s6",
    taskId: "t2",
    title: "Implement NextAuth Google provider",
    done: false,
    assignee: USERS[1],
  },
  {
    id: "s7",
    taskId: "t2",
    title: "Write callback handler + session mapping",
    done: false,
    assignee: USERS[1],
  },
];

const subtasksT3: Subtask[] = [
  {
    id: "s8",
    taskId: "t3",
    title: "Add zxcvbn strength meter to UI",
    done: true,
    assignee: USERS[2],
  },
  {
    id: "s9",
    taskId: "t3",
    title: "Block passwords scoring below 2",
    done: true,
    assignee: USERS[2],
  },
  {
    id: "s10",
    taskId: "t3",
    title: "Unit test edge cases (common passwords)",
    done: false,
    assignee: USERS[0],
  },
];

const subtasksT4: Subtask[] = [
  {
    id: "s11",
    taskId: "t4",
    title: "Store JWT in httpOnly cookie",
    done: true,
    assignee: USERS[3],
  },
  {
    id: "s12",
    taskId: "t4",
    title: "Implement sliding expiry refresh",
    done: false,
    assignee: USERS[3],
  },
];

const subtasksT5: Subtask[] = [
  {
    id: "s13",
    taskId: "t5",
    title: "Design KPI card components",
    done: false,
    assignee: USERS[0],
  },
  {
    id: "s14",
    taskId: "t5",
    title: "Wire up mock rollup data",
    done: false,
    assignee: USERS[1],
  },
  {
    id: "s15",
    taskId: "t5",
    title: "Add overdue task count badge",
    done: false,
    assignee: USERS[2],
  },
];

const subtasksT6: Subtask[] = [
  {
    id: "s16",
    taskId: "t6",
    title: "Define EWS trigger logic",
    done: false,
    assignee: USERS[1],
  },
  {
    id: "s17",
    taskId: "t6",
    title: "Build feed UI component",
    done: false,
    assignee: USERS[2],
  },
  {
    id: "s18",
    taskId: "t6",
    title: "Add at-risk badge to task cards",
    done: false,
    assignee: USERS[0],
  },
  {
    id: "s19",
    taskId: "t6",
    title: "Write unit tests for threshold calculation",
    done: false,
  },
];

const subtasksT7: Subtask[] = [
  {
    id: "s20",
    taskId: "t7",
    title: "Design utilization bar chart",
    done: false,
    assignee: USERS[0],
  },
  {
    id: "s21",
    taskId: "t7",
    title: "Compute estimated hours per user from tasks",
    done: false,
    assignee: USERS[1],
  },
  {
    id: "s22",
    taskId: "t7",
    title: "Add over/under capacity color coding",
    done: false,
    assignee: USERS[2],
  },
];

const subtasksT8: Subtask[] = [
  {
    id: "s23",
    taskId: "t8",
    title: "Define CSV column schema",
    done: false,
    assignee: USERS[3],
  },
  {
    id: "s24",
    taskId: "t8",
    title: "Implement filter UI (date range, assignee)",
    done: false,
    assignee: USERS[0],
  },
  {
    id: "s25",
    taskId: "t8",
    title: "Wire csv-stringify + download trigger",
    done: false,
    assignee: USERS[3],
  },
];

const subtasksT9: Subtask[] = [
  {
    id: "s26",
    taskId: "t9",
    title: "Scope drill-down UX from dashboard",
    done: false,
    assignee: USERS[1],
  },
  {
    id: "s27",
    taskId: "t9",
    title: "Build drill-down panel component",
    done: false,
    assignee: USERS[2],
  },
  {
    id: "s28",
    taskId: "t9",
    title: "Link Epic → Tasks → Subtasks in panel",
    done: false,
    assignee: USERS[2],
  },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const TASKS: Task[] = [
  // Epic 1 — Authentication Overhaul
  {
    id: "t1",
    epicId: "e1",
    title: "Login page redesign",
    description:
      "Redesign the login page to match the updated Figma spec (file: Alpha / Auth v2). Priority is mobile breakpoints and the new brand colour palette. Must pass WCAG AA contrast ratios.",
    assignee: USERS[0],
    status: "In Progress",
    priority: "High",
    dueDate: "2026-02-20",
    estimate: 8,
    subtasks: subtasksT1,
    comments: commentsT1,
  },
  {
    id: "t2",
    epicId: "e1",
    title: "OAuth integration (Google)",
    description:
      "Add Google OAuth as a sign-in option using NextAuth. The user should be able to sign in with their Google workspace account and have a matching user record created on first login.",
    assignee: USERS[1],
    status: "To Do",
    priority: "High",
    dueDate: "2026-02-25",
    estimate: 6,
    subtasks: subtasksT2,
    comments: commentsT2,
  },
  {
    id: "t3",
    epicId: "e1",
    title: "Password strength enforcement",
    description:
      "Integrate zxcvbn on the registration and change-password forms. Block weak passwords (score < 2) with a clear, non-jargon error message.",
    assignee: USERS[2],
    status: "Review",
    priority: "Medium",
    dueDate: "2026-02-18",
    estimate: 4,
    subtasks: subtasksT3,
    comments: commentsT3,
  },
  {
    id: "t4",
    epicId: "e1",
    title: "Session token management",
    description:
      "Implement httpOnly cookie-based JWT storage with sliding expiry. Token duration should be configurable via environment variable.",
    assignee: USERS[3],
    status: "In Progress",
    priority: "High",
    dueDate: "2026-02-22",
    estimate: 5,
    subtasks: subtasksT4,
    comments: commentsT4,
  },
  {
    id: "t5",
    epicId: "e1",
    title: "Auth error state handling",
    description:
      "Design and implement consistent error states for: invalid credentials, account locked, email not verified. Use toast notifications and inline field errors.",
    assignee: null,
    status: "To Do",
    priority: "Low",
    dueDate: "2026-02-28",
    estimate: 3,
    subtasks: subtasksT5,
    comments: commentsT5,
  },
  // Epic 2 — Reporting Dashboard
  {
    id: "t6",
    epicId: "e2",
    title: "Early Warning System (EWS) feed",
    description:
      "Build the EWS feed on the management dashboard. Trigger logic: task has been In Progress for longer than its estimated hours × 1.5 (configurable). Display triggered tasks in a dedicated feed with at-risk badge.",
    assignee: USERS[1],
    status: "To Do",
    priority: "High",
    dueDate: "2026-03-10",
    estimate: 10,
    subtasks: subtasksT6,
    comments: [],
  },
  {
    id: "t7",
    epicId: "e2",
    title: "Utilization chart",
    description:
      "Show estimated workload per team member against their weekly capacity (default 40h). Colour-code over-capacity (>100%) and under-capacity (<50%) states. Filterable by project and week.",
    assignee: USERS[0],
    status: "To Do",
    priority: "Medium",
    dueDate: "2026-03-14",
    estimate: 8,
    subtasks: subtasksT7,
    comments: [],
  },
  {
    id: "t8",
    epicId: "e2",
    title: "CSV export",
    description:
      "Allow export of task data as CSV from workspace, project, and filtered list views. Columns: task ID, title, epic, assignee, status, priority, estimate, due date, created date, completed date, cycle time.",
    assignee: USERS[3],
    status: "To Do",
    priority: "Low",
    dueDate: "2026-03-20",
    estimate: 5,
    subtasks: subtasksT8,
    comments: [],
  },
  {
    id: "t9",
    epicId: "e2",
    title: "Epic drill-down panel",
    description:
      "From the management dashboard, users should be able to drill from Epic → Tasks → Subtasks without leaving the page. Implement as a slide-over panel or inline expansion.",
    assignee: USERS[2],
    status: "To Do",
    priority: "Medium",
    dueDate: "2026-03-18",
    estimate: 6,
    subtasks: subtasksT9,
    comments: [],
  },
];

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

export function getEpicProgress(epicId: string): number {
  const epicTasks = TASKS.filter((t) => t.epicId === epicId);
  if (epicTasks.length === 0) return 0;
  const total = epicTasks.reduce((sum, t) => sum + getTaskProgress(t), 0);
  return Math.round(total / epicTasks.length);
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

export function getProjectById(projectId: string): Project | undefined {
  return PROJECTS.find((p) => p.id === projectId);
}

export function getEpicsByProject(projectId: string): Epic[] {
  return EPICS.filter((e) => e.projectId === projectId);
}

export function getProjectProgress(projectId: string): number {
  const projectEpics = getEpicsByProject(projectId);
  if (projectEpics.length === 0) return 0;
  const total = projectEpics.reduce((sum, e) => sum + getEpicProgress(e.id), 0);
  return Math.round(total / projectEpics.length);
}

export function getProjectHealthIndicators(projectId: string): {
  overdueCount: number;
  atRiskCount: number;
} {
  const projectEpics = getEpicsByProject(projectId);
  const projectTasks = TASKS.filter((t) =>
    projectEpics.some((e) => e.id === t.epicId),
  );

  // Mock health indicators (in real app would calculate from dates/progress)
  const overdueCount = projectTasks.filter((t) => {
    const due = new Date(t.dueDate);
    const now = new Date("2026-02-10");
    return due < now && t.status !== "Done";
  }).length;

  const atRiskCount = projectTasks.filter((t) => {
    return t.status === "In Progress" && t.priority === "High";
  }).length;

  return { overdueCount, atRiskCount };
}
