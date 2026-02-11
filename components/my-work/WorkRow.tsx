import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { EPICS } from "@/lib/mock";
import { Subtask, Task } from "@/lib/types";
import { CalendarDays, CheckSquare, Square } from "lucide-react";
import Link from "next/link";

interface TaskRowProps {
  task: Task;
}

export function TaskRow({ task }: TaskRowProps) {
  const epic = EPICS.find((e) => e.id === task.epicId);
  const isOverdue =
    new Date(task.dueDate) < new Date("2026-02-10") && task.status !== "Done";

  // At Risk logic: time logged > 1.2x estimate
  const totalMinutesLogged = task.timeEntries.reduce(
    (acc, entry) => acc + entry.minutes,
    0,
  );
  const totalHoursLogged = totalMinutesLogged / 60;
  const estimateHours = task.estimate || 0;
  const isOverBudget =
    estimateHours > 0 && totalHoursLogged > estimateHours * 1.2;

  return (
    <Link href={`/task/${task.id}`}>
      <div className="group flex items-center gap-4 rounded-lg border border-border bg-white px-4 py-3 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground group-hover:text-indigo-700 transition-colors truncate">
            {task.title}
            {isOverBudget && (
              <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                At Risk
              </span>
            )}
          </p>
          {epic && (
            <span className="text-xs text-indigo-500 bg-indigo-50 rounded px-1.5 py-0.5 mt-1 inline-block">
              {epic.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <PriorityBadge priority={task.priority} />
          <span
            className={`flex items-center gap-1 text-xs ${
              isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {isOverdue ? "Overdue · " : ""}
            {task.dueDate}
          </span>
        </div>
      </div>
    </Link>
  );
}

interface SubtaskRowProps {
  subtask: Subtask;
  parentTask: Task;
}

export function SubtaskRow({ subtask, parentTask }: SubtaskRowProps) {
  return (
    <Link href={`/task/${parentTask.id}`}>
      <div className="group flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer">
        {subtask.done ? (
          <CheckSquare className="h-4 w-4 text-green-500 shrink-0" />
        ) : (
          <Square className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground group-hover:text-indigo-700 truncate">
            {subtask.title}
          </p>
          <p className="text-xs text-muted-foreground">
            in <span className="text-foreground">{parentTask.title}</span>
          </p>
        </div>
        {subtask.dueDate && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <CalendarDays className="h-3.5 w-3.5" />
            {subtask.dueDate}
          </span>
        )}
      </div>
    </Link>
  );
}
