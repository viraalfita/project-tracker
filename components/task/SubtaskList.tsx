"use client";

import { useState } from "react";
import { Subtask } from "@/lib/types";
import { AvatarChip } from "@/components/shared/AvatarChip";
import { CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { canWrite } from "@/lib/permissions";

interface SubtaskListProps {
  initialSubtasks: Subtask[];
}

export function SubtaskList({ initialSubtasks }: SubtaskListProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks);
  const { currentUser } = useAuth();
  const editable = canWrite(currentUser);

  function toggle(id: string) {
    if (!editable) return;
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  }

  const doneCount = subtasks.filter((s) => s.done).length;
  const progress = subtasks.length > 0 ? Math.round((doneCount / subtasks.length) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          Subtasks
        </h3>
        <span className="text-xs text-muted-foreground">
          {doneCount} / {subtasks.length} done · {progress}%
        </span>
      </div>

      {/* Progress bar */}
      {subtasks.length > 0 && (
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {subtasks.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">No subtasks yet.</p>
      ) : (
        <ul className="space-y-1">
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              onClick={() => toggle(subtask.id)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 group transition-colors",
                editable ? "hover:bg-accent cursor-pointer" : "cursor-default"
              )}
            >
              {subtask.done ? (
                <CheckSquare className="h-4 w-4 text-indigo-600 shrink-0" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 shrink-0 transition-colors" />
              )}
              <span
                className={cn(
                  "flex-1 text-sm",
                  subtask.done ? "line-through text-muted-foreground" : "text-foreground"
                )}
              >
                {subtask.title}
              </span>
              {subtask.assignee && (
                <AvatarChip user={subtask.assignee} size="sm" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
