import { PROJECT_MEMBERS } from "./mock";
import { User } from "./types";

/**
 * Returns true if the user can create/edit content (Admin or Member).
 * Manager and Viewer are read-only per PRD.
 */
export function canWrite(user: User | null): boolean {
  if (!user) return false;
  return user.role === "Admin" || user.role === "Member";
}

/**
 * Returns true if the user can view the given project.
 * Admin/Manager see all. Member only sees explicitly listed projects.
 */
export function canViewProject(user: User | null, projectId: string): boolean {
  if (!user) return false;
  if (user.role === "Admin" || user.role === "Manager") return true;
  return PROJECT_MEMBERS[projectId]?.includes(user.id) ?? false;
}
