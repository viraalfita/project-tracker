"use client";

import { CheckSquare } from "lucide-react";
import { TASKS, PROJECT } from "@/lib/mock";
import { TaskStatus } from "@/lib/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AvatarChip } from "@/components/shared/AvatarChip";
import { WorkSection } from "@/components/my-work/WorkSection";
import { useAuth } from "@/contexts/AuthContext";

const ORDERED_STATUSES: TaskStatus[] = ["In Progress", "Review", "To Do", "Done"];

export default function MyWorkPage() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const myTasks = TASKS.filter((t) => t.assignee?.id === currentUser.id);

  // Subtasks assigned to current user, with their parent task reference
  const mySubtaskEntries = TASKS.flatMap((task) =>
    task.subtasks
      .filter((s) => s.assignee?.id === currentUser.id)
      .map((s) => ({ subtask: s, parentTaskId: task.id }))
  );

  const tasksByStatus = (status: TaskStatus) => myTasks.filter((t) => t.status === status);

  const subtasksByStatus = (status: TaskStatus) =>
    mySubtaskEntries.filter(({ subtask, parentTaskId }) => {
      const parent = TASKS.find((t) => t.id === parentTaskId)!;
      if (status === "Done") return subtask.done;
      return !subtask.done && parent.status === status;
    });

  const totalItems = myTasks.length + mySubtaskEntries.length;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs
          items={[
            { label: PROJECT.name, href: "/dashboard" },
            { label: "My Work" },
          ]}
        />
      </div>

      <div className="flex-1 px-6 py-6">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-6">
          <CheckSquare className="h-5 w-5 text-indigo-600" />
          <div>
            <h1 className="text-xl font-bold text-foreground">My Work</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <AvatarChip user={currentUser} size="sm" showName />
              <span className="text-xs text-muted-foreground">· {totalItems} items assigned</span>
            </div>
          </div>
        </div>

        {totalItems === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground text-sm">Nothing assigned to you yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ORDERED_STATUSES.map((status) => {
              const tasks = tasksByStatus(status);
              const subtasks = subtasksByStatus(status);
              return (
                <WorkSection
                  key={status}
                  status={status}
                  tasks={tasks}
                  subtasks={subtasks}
                  defaultExpanded={status !== "Done"}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
