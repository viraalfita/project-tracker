"use client";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useDataStore } from "@/contexts/DataStore";
import { USERS } from "@/lib/mock";
import { BarChart2, Calendar } from "lucide-react";
import { useState } from "react";

type DateRange = "this-week" | "next-week" | "all";

function getWeekRange(type: "this-week" | "next-week") {
  const today = new Date("2026-02-11"); // Current date from context
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  if (type === "this-week") {
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
  } else {
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + mondayOffset + 7);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    return { start: nextMonday, end: nextSunday };
  }
}

function formatDateRange(range: { start: Date; end: Date }) {
  const fmt = (d: Date) =>
    `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  return `${fmt(range.start)} - ${fmt(range.end)}`;
}

export default function UtilizationPage() {
  const { tasks } = useDataStore();
  const [dateRange, setDateRange] = useState<DateRange>("this-week");

  // Filter tasks based on date range
  const getFilteredTasks = () => {
    const openTasks = tasks.filter((t) => t.status !== "Done");

    if (dateRange === "all") {
      return openTasks;
    }

    const range = getWeekRange(dateRange);
    return openTasks.filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      return taskDate >= range.start && taskDate <= range.end;
    });
  };

  const filteredTasks = getFilteredTasks();

  const utilization = USERS.map((user) => {
    const userTasks = filteredTasks.filter((t) => t.assignee?.id === user.id);
    const totalEstimate = userTasks.reduce(
      (sum, t) => sum + (t.estimate ?? 0),
      0,
    );
    const capacity = user.weeklyCapacity;
    const pct = capacity > 0 ? Math.round((totalEstimate / capacity) * 100) : 0;
    return { user, totalEstimate, pct, openTasks: userTasks.length, capacity };
  });

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

      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-foreground">
              Team Utilization
            </h1>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="rounded border border-border bg-white px-3 py-1.5 text-sm text-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
        </div>

        <div className="mb-4 rounded-lg bg-indigo-50 border border-indigo-200 p-3">
          <p className="text-sm text-indigo-900">
            <strong>
              Utilization = Assigned Estimated Hours / Weekly Capacity
            </strong>
          </p>
          <p className="text-xs text-indigo-700 mt-1">
            Shows workload based on task estimates for{" "}
            {dateRange === "this-week"
              ? "this week"
              : dateRange === "next-week"
                ? "next week"
                : "all open work"}
            . Only tasks with due dates are included in weekly views.
          </p>
        </div>

        <div className="space-y-4 max-w-2xl">
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

        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-700">
            <strong>Note:</strong> Weekly capacity is configurable per user.
            Default is 40h/week for full-time members. Designer has 32h/week
            (part-time). Utilization helps managers balance workload and
            identify overallocation early.
          </p>
        </div>
      </div>
    </div>
  );
}
