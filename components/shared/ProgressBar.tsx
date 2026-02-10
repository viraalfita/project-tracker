import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  className,
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  const color =
    clamped >= 80
      ? "bg-green-500"
      : clamped >= 40
        ? "bg-blue-500"
        : "bg-slate-300";

  const heightClass = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex-1 rounded-full bg-slate-100 overflow-hidden",
          heightClass,
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">
          {clamped}%
        </span>
      )}
    </div>
  );
}
