"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronRight, CalendarDays } from "lucide-react";
import { Task } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { AvatarChip, UnassignedChip } from "@/components/shared/AvatarChip";
import { AddTaskDialog } from "@/components/epic/AddTaskDialog";
import { getTaskProgress } from "@/lib/mock";
import { useAuth } from "@/contexts/AuthContext";
import { canWrite } from "@/lib/permissions";

interface EpicTasksTabProps {
  tasks: Task[];
  epicId: string;
}

export function EpicTasksTab({ tasks, epicId }: EpicTasksTabProps) {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();
  const editable = canWrite(currentUser);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} in this epic
        </p>
        {editable && (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">No tasks yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const progress = getTaskProgress(task);
            const doneSubtasks = task.subtasks.filter((s) => s.done).length;
            return (
              <Link key={task.id} href={`/task/${task.id}`}>
                <div className="group flex items-center gap-4 rounded-lg border border-border bg-white px-4 py-3 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground group-hover:text-indigo-700 transition-colors truncate">
                        {task.title}
                      </span>
                      {!task.assignee && (
                        <span className="text-xs text-red-500 font-medium">Unassigned</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                      {task.subtasks.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {doneSubtasks}/{task.subtasks.length} subtasks · {progress}%
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {task.assignee ? (
                      <AvatarChip user={task.assignee} size="sm" />
                    ) : (
                      <UnassignedChip size="sm" />
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <AddTaskDialog open={open} onClose={() => setOpen(false)} epicId={epicId} />
    </div>
  );
}
