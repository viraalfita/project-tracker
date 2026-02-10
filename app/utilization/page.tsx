import { BarChart2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PROJECT, USERS, TASKS } from "@/lib/mock";

export default function UtilizationPage() {
  const CAPACITY_HOURS = 40;

  const utilization = USERS.map((user) => {
    const openTasks = TASKS.filter(
      (t) => t.assignee?.id === user.id && t.status !== "Done"
    );
    const totalEstimate = openTasks.reduce((sum, t) => sum + (t.estimate ?? 0), 0);
    const pct = Math.round((totalEstimate / CAPACITY_HOURS) * 100);
    return { user, totalEstimate, pct, openTasks: openTasks.length };
  });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs
          items={[{ label: PROJECT.name, href: "/dashboard" }, { label: "Utilization" }]}
        />
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="h-5 w-5 text-indigo-600" />
          <h1 className="text-xl font-bold text-foreground">Utilization</h1>
          <span className="text-sm text-muted-foreground">— estimated hours vs. 40h/week capacity</span>
        </div>

        <div className="space-y-4 max-w-xl">
          {utilization.map(({ user, totalEstimate, pct, openTasks }) => {
            const barColor =
              pct > 100 ? "bg-red-500" : pct >= 50 ? "bg-green-500" : "bg-amber-400";
            const label =
              pct > 100 ? "Over capacity" : pct < 50 ? "Under capacity" : "On track";
            const labelColor =
              pct > 100 ? "text-red-600" : pct < 50 ? "text-amber-600" : "text-green-600";

            return (
              <div key={user.id} className="rounded-lg border border-border bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: user.avatarColor }}
                    >
                      {user.initials}
                    </span>
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                    <span className="text-xs text-muted-foreground">({user.role})</span>
                  </div>
                  <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
                </div>

                <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{totalEstimate}h estimated · {openTasks} open tasks</span>
                  <span>{pct}% of {CAPACITY_HOURS}h</span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Capacity: 40h/week (default). Estimates sourced from open task fields.
        </p>
      </div>
    </div>
  );
}
