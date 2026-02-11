import { AvatarChip } from "@/components/shared/AvatarChip";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getEpicsByProject,
  getProjectHealthIndicators,
  getProjectProgress,
  USERS,
} from "@/lib/mock";
import { Project } from "@/lib/types";
import { AlertCircle, Clock, FolderOpen } from "lucide-react";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const progress = getProjectProgress(project.id);
  const epics = getEpicsByProject(project.id);
  const { overdueCount, atRiskCount } = getProjectHealthIndicators(project.id);
  const members = USERS.filter((u) => project.memberIds.includes(u.id));

  return (
    <div className="space-y-4">
      {/* Title row */}
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-indigo-50 p-2.5">
          <FolderOpen className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-foreground">
              {project.name}
            </h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground mb-1">Owner</p>
          <AvatarChip user={project.owner} size="sm" showName />
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground mb-1">Progress</p>
          <div className="flex items-center gap-2">
            <ProgressBar value={progress} size="sm" showLabel={false} />
            <span className="text-sm font-semibold text-foreground">
              {progress}%
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground mb-1">Epics</p>
          <p className="text-lg font-bold text-foreground">{epics.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground mb-1">Team</p>
          <p className="text-lg font-bold text-foreground">{members.length}</p>
        </div>
      </div>

      {/* Health indicators */}
      {(overdueCount > 0 || atRiskCount > 0) && (
        <div className="flex items-center gap-3 text-sm">
          {overdueCount > 0 && (
            <div className="flex items-center gap-1.5 text-red-600">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{overdueCount} overdue tasks</span>
            </div>
          )}
          {atRiskCount > 0 && (
            <div className="flex items-center gap-1.5 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">{atRiskCount} at-risk tasks</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
