"use client";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AvatarChip, UnassignedChip } from "@/components/shared/AvatarChip";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CommentsSection } from "@/components/task/CommentsSection";
import { SubtaskList } from "@/components/task/SubtaskList";
import { useAuth } from "@/contexts/AuthContext";
import { EPICS, TASKS, getProjectById } from "@/lib/mock";
import { canWrite } from "@/lib/permissions";
import { TaskStatus } from "@/lib/types";
import { CalendarDays, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useState } from "react";

const STATUSES: TaskStatus[] = ["To Do", "In Progress", "Review", "Done"];

interface TaskPageProps {
  params: Promise<{ taskId: string }>;
}

export default function TaskPage({ params }: TaskPageProps) {
  const { taskId } = use(params);
  const task = TASKS.find((t) => t.id === taskId);
  if (!task) notFound();

  const epic = EPICS.find((e) => e.id === task.epicId);
  const project = epic ? getProjectById(epic.projectId) : undefined;

  const [status, setStatus] = useState<TaskStatus>(task.status);
  const { currentUser } = useAuth();
  const editable = canWrite(currentUser);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            ...(project
              ? [{ label: project.name, href: `/projects/${project.id}` }]
              : []),
            ...(epic ? [{ label: epic.title, href: `/epic/${epic.id}` }] : []),
            { label: task.title },
          ]}
        />
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="max-w-2xl space-y-6">
          {/* Task header */}
          <div className="rounded-lg border border-border bg-white p-6">
            {/* Title + status */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-xl font-bold text-foreground leading-tight flex-1">
                {task.title}
              </h1>
              {/* Status selector — disabled for read-only roles */}
              <div className="shrink-0">
                {editable ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={status} />
                )}
              </div>
            </div>

            {/* Current status badge (reflects select) */}
            <div className="mb-4">
              <StatusBadge status={status} />
            </div>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-5 text-sm">
              {/* Assignee */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Assignee
                </span>
                {task.assignee ? (
                  <AvatarChip user={task.assignee} showName />
                ) : (
                  <span className="flex items-center gap-1.5 text-sm text-red-500">
                    <UnassignedChip />
                    Unassigned
                  </span>
                )}
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Priority
                </span>
                <PriorityBadge priority={task.priority} />
              </div>

              {/* Due date */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Due Date
                </span>
                <span className="flex items-center gap-1.5 text-sm text-foreground">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  {task.dueDate}
                </span>
              </div>

              {/* Estimate */}
              {task.estimate && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Estimate
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {task.estimate}h
                  </span>
                </div>
              )}

              {/* Epic */}
              {epic && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Epic
                  </span>
                  <span className="text-sm text-indigo-600 bg-indigo-50 rounded px-2 py-0.5">
                    {epic.title}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Description
            </h2>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>

          {/* Subtasks */}
          <div className="rounded-lg border border-border bg-white p-6">
            <SubtaskList initialSubtasks={task.subtasks} />
          </div>

          {/* Comments */}
          <div className="rounded-lg border border-border bg-white p-6">
            <CommentsSection initialComments={task.comments} />
          </div>
        </div>
      </div>
    </div>
  );
}
