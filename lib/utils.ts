import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task, User } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILIZATION CALCULATION UTILITIES
// Single source of truth for resource utilization calculations
// ═══════════════════════════════════════════════════════════════════════════

export type DateRangeFilter = "this-week" | "next-week" | "all" | "none";

/**
 * Get date range bounds for weekly filters
 */
export function getWeekRange(type: "this-week" | "next-week") {
  const today = new Date("2026-02-11");
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  if (type === "this-week") {
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
  } else {
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + mondayOffset + 7);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    return { start: nextMonday, end: nextSunday };
  }
}

/**
 * Format date range for display
 */
export function formatDateRange(range: { start: Date; end: Date }) {
  const fmt = (d: Date) =>
    `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  return `${fmt(range.start)} - ${fmt(range.end)}`;
}

/**
 * Filter tasks by date range
 * @param tasks - All tasks to filter
 * @param dateRange - Date range filter type
 * @returns Filtered tasks
 */
export function filterTasksByDateRange(
  tasks: Task[],
  dateRange: DateRangeFilter,
): Task[] {
  if (dateRange === "all" || dateRange === "none") {
    return tasks;
  }

  const range = getWeekRange(dateRange);
  return tasks.filter((t) => {
    if (!t.dueDate) return false;
    const taskDate = new Date(t.dueDate);
    return taskDate >= range.start && taskDate <= range.end;
  });
}

/**
 * Calculate utilization for a single user
 * SINGLE SOURCE OF TRUTH for utilization calculation
 * @param user - User to calculate utilization for
 * @param tasks - Filtered tasks (should already be filtered by epic, date range, and status)
 * @returns Utilization data for the user
 */
export function calculateUserUtilization(user: User, tasks: Task[]) {
  const userTasks = tasks.filter((t) => t.assignee?.id === user.id);
  const totalEstimate = userTasks.reduce(
    (sum, t) => sum + (t.estimate ?? 0),
    0,
  );
  const capacity = user.weeklyCapacity;
  const pct = capacity > 0 ? Math.round((totalEstimate / capacity) * 100) : 0;

  return {
    user,
    totalEstimate,
    pct,
    capacity,
    openTasks: userTasks.length,
  };
}

/**
 * Calculate utilization for all users with consistent filtering
 * @param users - Array of users
 * @param allTasks - All tasks in the system
 * @param filters - Optional filters to apply
 * @returns Array of utilization data per user
 */
export function calculateUtilization(
  users: User[],
  allTasks: Task[],
  filters?: {
    epicId?: string;
    dateRange?: DateRangeFilter;
    excludeCompleted?: boolean;
  },
) {
  let filteredTasks = allTasks;

  // Apply status filter
  if (filters?.excludeCompleted !== false) {
    filteredTasks = filteredTasks.filter((t) => t.status !== "Done");
  }

  // Apply epic filter
  if (filters?.epicId) {
    filteredTasks = filteredTasks.filter((t) => t.epicId === filters.epicId);
  }

  // Apply date range filter
  if (filters?.dateRange && filters.dateRange !== "none") {
    filteredTasks = filterTasksByDateRange(filteredTasks, filters.dateRange);
  }

  // Calculate utilization for each user using the SAME filtered tasks
  return users.map((user) => calculateUserUtilization(user, filteredTasks));
}

/**
 * Calculate aggregate utilization metrics
 */
export function calculateUtilizationAggregates(
  utilization: ReturnType<typeof calculateUserUtilization>[],
) {
  const overCapacity = utilization.filter((u) => u.pct > 100).length;
  const avgUtilization =
    utilization.length > 0
      ? Math.round(
          utilization.reduce((sum, u) => sum + u.pct, 0) / utilization.length,
        )
      : 0;

  return {
    overCapacity,
    avgUtilization,
    totalUsers: utilization.length,
  };
}
