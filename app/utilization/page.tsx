"use client";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useDataStore } from "@/contexts/DataStore";
import { EPICS, USERS } from "@/lib/mock";
import {
  calculateUtilization,
  DateRangeFilter,
  formatDateRange,
  getWeekRange,
} from "@/lib/utils";
import { BarChart2, Calendar, Filter, Layers, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function UtilizationPage() {
  const { tasks } = useDataStore();
  const [dateRange, setDateRange] = useState<DateRangeFilter>("this-week");
  const [epicFilter, setEpicFilter] = useState("");

  // Calculate utilization using shared utility with consistent filtering
  const utilization = useMemo(
    () =>
      calculateUtilization(USERS, tasks, {
        epicId: epicFilter || undefined,
        dateRange: dateRange,
        excludeCompleted: true,
      }),
    [tasks, dateRange, epicFilter],
  );

  // Get filtered tasks for project breakdown (same filters as utilization)
  const filteredTasks = useMemo(() => {
    let openTasks = tasks.filter((t) => t.status !== "Done");

    if (epicFilter) {
      openTasks = openTasks.filter((t) => t.epicId === epicFilter);
    }

    if (dateRange === "all") {
      return openTasks;
    }

    if (dateRange !== "none") {
      const range = getWeekRange(dateRange);
      openTasks = openTasks.filter((t) => {
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        return taskDate >= range.start && taskDate <= range.end;
      });
    }

    return openTasks;
  }, [tasks, dateRange, epicFilter]);

  // Count by project / epic
  const countByEpic = useMemo(() => {
    return EPICS.map((epic) => {
      const epicTasks = filteredTasks.filter((t) => t.epicId === epic.id);
      const totalEstimate = epicTasks.reduce(
        (sum, t) => sum + (t.estimate ?? 0),
        0,
      );
      return {
        epic,
        taskCount: epicTasks.length,
        totalEstimate,
      };
    }).filter((row) => row.taskCount > 0);
  }, [filteredTasks]);

  const hasFilters = epicFilter;

  const thisWeekRange = getWeekRange("this-week");
  const nextWeekRange = getWeekRange("next-week");

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Utilization" },
          ]}
        />
      </div>

      <div className="px-6 py-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-foreground">
              Resource Utilisation
            </h1>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className="mb-5 rounded-lg border border-border bg-white p-3 flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />

          {/* Project / Epic filter */}
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={epicFilter}
              onChange={(e) => setEpicFilter(e.target.value)}
              className="rounded border border-border bg-white px-2.5 py-1.5 text-sm text-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Projects</option>
              {EPICS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range filter */}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRangeFilter)}
              className="rounded border border-border bg-white px-2.5 py-1.5 text-sm text-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="this-week">
                This Week ({formatDateRange(thisWeekRange)})
              </option>
              <option value="next-week">
                Next Week ({formatDateRange(nextWeekRange)})
              </option>
              <option value="all">All Open Tasks</option>
            </select>
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={() => setEpicFilter("")}
              className="flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        <div className="mb-4 rounded-lg bg-indigo-50 border border-indigo-200 p-3">
          <p className="text-sm text-indigo-900">
            <strong>
              Utilisation = Assigned Estimated Hours / Weekly Capacity
            </strong>
          </p>
          <p className="text-xs text-indigo-700 mt-1">
            Shows workload based on task estimates for{" "}
            {dateRange === "this-week"
              ? "this week"
              : dateRange === "next-week"
                ? "next week"
                : "all open work"}
            {epicFilter
              ? ` · filtered by "${EPICS.find((e) => e.id === epicFilter)?.title}"`
              : ""}
            . Only tasks with due dates are included in weekly views.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Capacity per Member ── */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Capacity vs Actual Workload
            </h2>
            {utilization.map(
              ({ user, totalEstimate, pct, openTasks, capacity }) => {
                const barColor =
                  pct > 100
                    ? "bg-red-500"
                    : pct >= 80
                      ? "bg-amber-400"
                      : "bg-green-500";
                const label =
                  pct > 100
                    ? "Over capacity"
                    : pct >= 80
                      ? "Near capacity"
                      : "Available";
                const labelColor =
                  pct > 100
                    ? "text-red-600"
                    : pct >= 80
                      ? "text-amber-600"
                      : "text-green-600";

                return (
                  <div
                    key={user.id}
                    className="rounded-lg border border-border bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: user.avatarColor }}
                        >
                          {user.initials}
                        </span>
                        <div>
                          <span className="text-sm font-medium text-foreground block">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${labelColor}`}>
                        {label}
                      </span>
                    </div>

                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        <strong className="text-foreground">
                          {totalEstimate}h
                        </strong>{" "}
                        assigned
                        {openTasks > 0 &&
                          ` · ${openTasks} task${openTasks > 1 ? "s" : ""}`}
                      </span>
                      <span>
                        <strong className="text-foreground">{pct}%</strong> of{" "}
                        {capacity}h capacity
                      </span>
                    </div>
                  </div>
                );
              },
            )}
          </div>

          {/* ── Count by Project ── */}
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
              Count by Project
            </h2>
            <div className="rounded-lg border border-border bg-white overflow-hidden">
              {countByEpic.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No open tasks match the current filters.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-slate-50">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Project
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Tasks
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Est. Hrs
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {countByEpic.map(({ epic, taskCount, totalEstimate }) => (
                      <tr
                        key={epic.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-3 py-2.5">
                          <p className="font-medium text-foreground truncate max-w-[150px]">
                            {epic.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {epic.status}
                          </p>
                        </td>
                        <td className="px-3 py-2.5 text-right font-medium text-foreground">
                          {taskCount}
                        </td>
                        <td className="px-3 py-2.5 text-right font-medium text-foreground">
                          {totalEstimate}h
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 border-t border-border">
                      <td className="px-3 py-2 text-xs font-semibold text-foreground">
                        Total
                      </td>
                      <td className="px-3 py-2 text-right text-xs font-semibold text-foreground">
                        {countByEpic.reduce((s, r) => s + r.taskCount, 0)}
                      </td>
                      <td className="px-3 py-2 text-right text-xs font-semibold text-foreground">
                        {countByEpic.reduce((s, r) => s + r.totalEstimate, 0)}h
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                Available (&lt;80%)
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                Near capacity (80–99%)
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                Over capacity (&gt;100%)
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-700">
            <strong>Note:</strong> Weekly capacity is configurable per user.
            Default is 40h/week for full-time members. Designer has 32h/week
            (part-time). Utilisation helps managers balance workload and
            identify overallocation early.
          </p>
        </div>
      </div>
    </div>
  );
}
