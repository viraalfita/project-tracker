"use client";

import { KanbanColumn } from "@/components/board/KanbanColumn";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useAuth } from "@/contexts/AuthContext";
import { useDataStore } from "@/contexts/DataStore";
import { canWrite } from "@/lib/permissions";
import { Task, TaskStatus } from "@/lib/types";
import { Kanban } from "lucide-react";
import { useState } from "react";

const COLUMNS: TaskStatus[] = ["To Do", "In Progress", "Review", "Done"];

export default function BoardPage() {
  const { tasks: initialTasks } = useDataStore();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { currentUser } = useAuth();
  const editable = canWrite(currentUser);

  function handleMove(taskId: string, direction: "left" | "right") {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const idx = COLUMNS.indexOf(t.status);
        const nextIdx = direction === "left" ? idx - 1 : idx + 1;
        if (nextIdx < 0 || nextIdx >= COLUMNS.length) return t;
        return { ...t, status: COLUMNS[nextIdx] };
      }),
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Board" },
          ]}
        />
      </div>

      <div className="flex flex-col flex-1 px-6 py-5">
        <div className="flex items-center gap-2 mb-5">
          <Kanban className="h-5 w-5 text-indigo-600" />
          <h1 className="text-lg font-bold text-foreground">Task Board</h1>
          <span className="text-sm text-muted-foreground">
            — {tasks.length} tasks
          </span>
        </div>

        {/* Kanban grid */}
        <div className="grid grid-cols-4 gap-3 flex-1 min-h-0 pb-4">
          {COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              onMove={handleMove}
              canEdit={editable}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
