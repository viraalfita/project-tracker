import { cn } from "@/lib/utils";
import { Priority } from "@/lib/types";

const styles: Record<Priority, string> = {
  High: "bg-red-50 text-red-700 border border-red-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Low: "bg-slate-50 text-slate-600 border border-slate-200",
};

const dots: Record<Priority, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-slate-400",
};

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[priority],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[priority])} />
      {priority}
    </span>
  );
}
