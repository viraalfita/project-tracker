import Link from "next/link";
import { ChevronRight, CalendarDays } from "lucide-react";
import { Epic } from "@/lib/types";
import { getEpicProgress, getTasksByEpic } from "@/lib/mock";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AvatarChip } from "@/components/shared/AvatarChip";
import { ProgressBar } from "@/components/shared/ProgressBar";

interface EpicCardProps {
  epic: Epic;
}

export function EpicCard({ epic }: EpicCardProps) {
  const progress = getEpicProgress(epic.id);
  const tasks = getTasksByEpic(epic.id);
  const doneTasks = tasks.filter((t) => t.status === "Done").length;

  return (
    <Link href={`/epic/${epic.id}`}>
      <div className="group rounded-lg border border-border bg-white p-5 hover:shadow-sm hover:border-indigo-200 transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-foreground truncate group-hover:text-indigo-700 transition-colors">
                {epic.title}
              </h3>
              <StatusBadge status={epic.status} />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {epic.description}
            </p>

            <ProgressBar value={progress} className="mb-3" />

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <AvatarChip user={epic.owner} size="sm" showName />
              <span className="flex items-center gap-1">
                <span className="text-foreground font-medium">{doneTasks}</span>
                &nbsp;/ {tasks.length} tasks done
              </span>
              {epic.endDate && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Due {epic.endDate}
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
