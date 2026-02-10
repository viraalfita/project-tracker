import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PROJECTS, TASKS } from "@/lib/mock";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const openTasks = TASKS.filter((t) => t.status !== "Done").length;
  const inProgressTasks = TASKS.filter(
    (t) => t.status === "In Progress",
  ).length;
  const reviewTasks = TASKS.filter((t) => t.status === "Review").length;
  const doneTasks = TASKS.filter((t) => t.status === "Done").length;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs items={[{ label: "Dashboard" }]} />
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Page heading */}
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-indigo-600" />
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Management Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Overview of all active projects and key metrics
            </p>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Open Tasks", value: openTasks, color: "text-blue-600" },
            {
              label: "In Progress",
              value: inProgressTasks,
              color: "text-blue-600",
            },
            { label: "In Review", value: reviewTasks, color: "text-amber-600" },
            { label: "Done", value: doneTasks, color: "text-green-600" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-lg border border-border bg-white p-4"
            >
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Projects section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Projects — {PROJECTS.length}
            </h2>
            <div className="flex gap-2">
              {(["Not Started", "Active", "On Hold", "Done"] as const).map(
                (s) => {
                  const count = PROJECTS.filter((p) => p.status === s).length;
                  if (count === 0) return null;
                  return <StatusBadge key={s} status={s} />;
                },
              )}
            </div>
          </div>

          <div className="space-y-3">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
