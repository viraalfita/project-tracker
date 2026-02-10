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
import { AlertCircle, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = getProjectProgress(project.id);
  const epics = getEpicsByProject(project.id);
  const { overdueCount, atRiskCount } = getProjectHealthIndicators(project.id);
  const members = USERS.filter((u) => project.memberIds.includes(u.id));

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="group rounded-lg border border-border bg-white p-5 hover:shadow-sm hover:border-indigo-200 transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-foreground truncate group-hover:text-indigo-700 transition-colors">
                {project.name}
              </h3>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {project.description}
            </p>

            <ProgressBar value={progress} className="mb-3" />

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <AvatarChip user={project.owner} size="sm" showName />
              <span className="flex items-center gap-1">
                <span className="text-foreground font-medium">
                  {epics.length}
                </span>
                &nbsp;epic{epics.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-foreground font-medium">
                  {members.length}
                </span>
                &nbsp;member{members.length !== 1 ? "s" : ""}
              </span>
              {overdueCount > 0 && (
                <span className="flex items-center gap-1 text-red-600">
                  <Clock className="h-3.5 w-3.5" />
                  {overdueCount} overdue
                </span>
              )}
              {atRiskCount > 0 && (
                <span className="flex items-center gap-1 text-amber-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {atRiskCount} at-risk
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:text-indigo-500 transition-colors" />
        </div>
      </div>
    </Link>
  );
}
