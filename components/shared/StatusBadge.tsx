import { EpicStatus, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type AnyStatus = TaskStatus | EpicStatus;

const styles: Record<AnyStatus, string> = {
  "To Do": "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Review: "bg-amber-100 text-amber-700",
  Done: "bg-green-100 text-green-700",
  "Not Started": "bg-slate-100 text-slate-500",
  "On Hold": "bg-orange-100 text-orange-700",
};

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[status] ?? "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {status}
    </span>
  );
}
