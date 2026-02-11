"use client";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useAuth } from "@/contexts/AuthContext";
import { useDataStore } from "@/contexts/DataStore";
import { getEpicProgress, USERS } from "@/lib/mock";
import { canViewEpic } from "@/lib/permissions";
import { Epic } from "@/lib/types";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  TrendingUp,
  Users as UsersIcon,
} from "lucide-react";
import Link from "next/link";

type RiskLevel = "Low" | "Medium" | "High";

interface AttentionEpic {
  epic: Epic;
  progress: number;
  overdueCount: number;
  atRiskCount: number;
  taskCount: number;
  ownerUtilization: number;
  riskLevel: RiskLevel;
  attentionReasons: string[];
}

export default function DashboardPage() {
  const { epics, tasks } = useDataStore();
  const { currentUser } = useAuth();

  const CAPACITY_HOURS = 40;
  const NOW = new Date("2026-02-10");

  // Task metrics
  const openTasks = tasks.filter((t) => t.status !== "Done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "In Progress",
  ).length;
  const reviewTasks = tasks.filter((t) => t.status === "Review").length;
  const doneTasks = tasks.filter((t) => t.status === "Done").length;

  // Health indicators
  const overdueCount = tasks.filter((t) => {
    const due = new Date(t.dueDate);
    return due < NOW && t.status !== "Done";
  }).length;

  const atRiskCount = tasks.filter((t) => {
    return t.status === "In Progress" && t.priority === "High";
  }).length;

  // Utilization summary
  const utilization = USERS.map((user) => {
    const userTasks = tasks.filter(
      (t) => t.assignee?.id === user.id && t.status !== "Done",
    );
    const totalEstimate = userTasks.reduce(
      (sum, t) => sum + (t.estimate ?? 0),
      0,
    );
    const pct = Math.round((totalEstimate / CAPACITY_HOURS) * 100);
    return { user, totalEstimate, pct };
  });

  const overCapacity = utilization.filter((u) => u.pct > 100).length;
  const avgUtilization = Math.round(
    utilization.reduce((sum, u) => sum + u.pct, 0) / utilization.length,
  );

  // Epic health (for EWS section)
  const epicHealth = epics.map((epic) => {
    const epicTasks = tasks.filter((t) => t.epicId === epic.id);
    const progress = getEpicProgress(epic.id);
    const overdue = epicTasks.filter((t) => {
      const due = new Date(t.dueDate);
      return due < NOW && t.status !== "Done";
    }).length;

    return { epic, progress, overdue, taskCount: epicTasks.length };
  });

  const epicsAtRisk = epicHealth.filter(
    (e) => e.overdue > 0 || (e.progress < 30 && e.taskCount > 0),
  );

  // ── ATTENTION EPICS CALCULATION ────────────────────────────────────────────

  /**
   * Calculate which epics require attention based on:
   * - Has overdue tasks
   * - Has tasks marked "At Risk" (EWS triggered - High priority + In Progress)
   * - Progress < 30% and status = In Progress
   * - More than 30% of tasks are overdue
   * - Owner has utilization > 120%
   */
  const attentionEpics: AttentionEpic[] = epics
    .map((epic) => {
      const epicTasks = tasks.filter((t) => t.epicId === epic.id);
      const progress = getEpicProgress(epic.id);

      // Count overdue tasks
      const overdueCount = epicTasks.filter((t) => {
        const due = new Date(t.dueDate);
        return due < NOW && t.status !== "Done";
      }).length;

      // Count at-risk tasks (High priority + In Progress)
      const atRiskCount = epicTasks.filter(
        (t) => t.status === "In Progress" && t.priority === "High",
      ).length;

      // Owner utilization
      const ownerUtil = utilization.find((u) => u.user.id === epic.owner.id);
      const ownerUtilization = ownerUtil?.pct ?? 0;

      // Calculate attention reasons
      const reasons: string[] = [];
      let requiresAttention = false;

      if (overdueCount > 0) {
        reasons.push(
          `${overdueCount} overdue task${overdueCount > 1 ? "s" : ""}`,
        );
        requiresAttention = true;
      }

      if (atRiskCount > 0) {
        reasons.push(
          `${atRiskCount} at-risk task${atRiskCount > 1 ? "s" : ""}`,
        );
        requiresAttention = true;
      }

      if (progress < 30 && epic.status === "In Progress") {
        reasons.push(`Low progress (${progress}%)`);
        requiresAttention = true;
      }

      if (epicTasks.length > 0 && overdueCount / epicTasks.length > 0.3) {
        reasons.push(`>30% tasks overdue`);
        requiresAttention = true;
      }

      if (ownerUtilization > 120) {
        reasons.push(`Owner over capacity (${ownerUtilization}%)`);
        requiresAttention = true;
      }

      // Calculate risk level
      let riskLevel: RiskLevel = "Low";
      if (overdueCount >= 3 || atRiskCount >= 2) {
        riskLevel = "High";
      } else if (overdueCount >= 1 || atRiskCount >= 1) {
        riskLevel = "Medium";
      }

      return {
        epic,
        progress,
        overdueCount,
        atRiskCount,
        taskCount: epicTasks.length,
        ownerUtilization,
        riskLevel,
        attentionReasons: reasons,
        requiresAttention,
      };
    })
    .filter((item) => item.requiresAttention)
    .filter((item) => {
      // Role-based visibility
      if (!currentUser) return false;
      return canViewEpic(currentUser, item.epic.id);
    })
    .sort((a, b) => {
      // Sort by risk level (High > Medium > Low)
      const riskOrder = { High: 3, Medium: 2, Low: 1 };
      return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    }) as AttentionEpic[];

  // Risk level styling
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case "High":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          icon: AlertCircle,
        };
      case "Medium":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: AlertTriangle,
        };
      case "Low":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: Clock,
        };
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs items={[{ label: "Dashboard" }]} />
      </div>

      <div className="flex-1 px-6 py-6 space-y-6 overflow-auto">
        {/* Conditional Dashboard Rendering Based on Role */}
        {currentUser &&
        (currentUser.role === "Admin" || currentUser.role === "Manager") ? (
          // ═══════════════════════════════════════════════════════════════════
          // MONITORING DASHBOARD (Admin / Manager)
          // ═══════════════════════════════════════════════════════════════════
          <>
            {/* Page heading */}
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Management Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitoring & oversight — track health, utilization, and key
                  metrics
                </p>
              </div>
            </div>

            {/* KPI Cards */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                Key Metrics
              </h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">Open Tasks</p>
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    {openTasks}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {inProgressTasks} in progress
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">In Review</p>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-3xl font-bold text-amber-600">
                    {reviewTasks}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Awaiting approval
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {doneTasks}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((doneTasks / (doneTasks + openTasks)) * 100)}%
                    completion rate
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">
                      Avg Utilization
                    </p>
                    <UsersIcon className="h-4 w-4 text-indigo-500" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-600">
                    {avgUtilization}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {overCapacity} over capacity
                  </p>
                </div>
              </div>
            </div>

            {/* Early Warning System - Admin & Manager Only */}
            {currentUser &&
              (currentUser.role === "Admin" ||
                currentUser.role === "Manager") && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      Early Warning System
                    </h2>
                    <Link
                      href="/epics"
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View all epics →
                    </Link>
                  </div>
                  <div className="rounded-lg border border-border bg-white p-5">
                    {epicsAtRisk.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No epics at risk. All projects on track.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {epicsAtRisk
                          .slice(0, 5)
                          .map(({ epic, progress, overdue }) => (
                            <Link
                              key={epic.id}
                              href={`/epic/${epic.id}`}
                              className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-orange-200"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {epic.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {overdue > 0 && `${overdue} overdue tasks`}
                                  {overdue > 0 && progress < 30 && " · "}
                                  {progress < 30 && `${progress}% progress`}
                                </p>
                              </div>
                              <span className="ml-3 inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                                <AlertTriangle className="h-3 w-3" />
                                At Risk
                              </span>
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Health Dashboard */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                Health Dashboard
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-white p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Overdue Tasks
                  </h3>
                  {overdueCount === 0 ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No overdue tasks
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-4xl font-bold text-red-600 mb-2">
                        {overdueCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Require immediate attention
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-border bg-white p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    High Priority Tasks
                  </h3>
                  {atRiskCount === 0 ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        All under control
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-4xl font-bold text-amber-600 mb-2">
                        {atRiskCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        In progress, high priority
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Epics Requiring Attention */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Epics Requiring Attention
                </h2>
                {attentionEpics.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {attentionEpics.length} epic
                    {attentionEpics.length > 1 ? "s" : ""} need intervention
                  </span>
                )}
              </div>
              <div className="rounded-lg border border-border bg-white">
                {attentionEpics.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      No Epics require attention at this time
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All epics are on track
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {attentionEpics.map((item) => {
                      const riskBadge = getRiskBadge(item.riskLevel);
                      const RiskIcon = riskBadge.icon;

                      return (
                        <Link
                          key={item.epic.id}
                          href={`/epic/${item.epic.id}`}
                          className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                        >
                          {/* Epic Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {item.epic.title}
                              </p>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${riskBadge.bg} ${riskBadge.text} border ${riskBadge.border}`}
                              >
                                <RiskIcon className="h-3 w-3" />
                                {item.riskLevel} Risk
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {item.attentionReasons.join(" · ")}
                            </p>
                          </div>

                          {/* Owner */}
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white flex-shrink-0"
                              style={{
                                backgroundColor: item.epic.owner.avatarColor,
                              }}
                            >
                              {item.epic.owner.initials}
                            </span>
                            <div className="min-w-0 hidden sm:block">
                              <p className="text-xs font-medium text-foreground truncate">
                                {item.epic.owner.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Owner
                              </p>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="text-right min-w-[60px]">
                            <p className="text-sm font-semibold text-foreground">
                              {item.progress}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Progress
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div className="min-w-[90px]">
                            <span
                              className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                                item.epic.status === "Done"
                                  ? "bg-green-100 text-green-700"
                                  : item.epic.status === "In Progress"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {item.epic.status}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                Quick Actions
              </h2>
              <div className="grid grid-cols-4 gap-3">
                <Link
                  href="/epics"
                  className="rounded-lg border border-border bg-white p-4 hover:shadow-sm hover:border-indigo-300 transition-all"
                >
                  <p className="text-sm font-medium text-foreground">
                    Browse Epics
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {epics.length} total
                  </p>
                </Link>
                <Link
                  href="/my-work"
                  className="rounded-lg border border-border bg-white p-4 hover:shadow-sm hover:border-indigo-300 transition-all"
                >
                  <p className="text-sm font-medium text-foreground">My Work</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your tasks
                  </p>
                </Link>
                <Link
                  href="/board"
                  className="rounded-lg border border-border bg-white p-4 hover:shadow-sm hover:border-indigo-300 transition-all"
                >
                  <p className="text-sm font-medium text-foreground">
                    Board View
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Kanban</p>
                </Link>
                <Link
                  href="/utilization"
                  className="rounded-lg border border-border bg-white p-4 hover:shadow-sm hover:border-indigo-300 transition-all"
                >
                  <p className="text-sm font-medium text-foreground">
                    Utilization
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Team capacity
                  </p>
                </Link>
              </div>
            </div>
          </>
        ) : (
          // ═══════════════════════════════════════════════════════════════════
          // PERSONAL WORK DASHBOARD (Member / Viewer)
          // ═══════════════════════════════════════════════════════════════════
          <>
            {/* Page heading */}
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  My Work Overview
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track your assigned tasks and progress
                </p>
              </div>
            </div>

            {/* My Task Progress */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                My Task Progress
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {/* Total Assigned */}
                <div className="rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">
                      Total Assigned
                    </p>
                    <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-600">
                    {currentUser
                      ? tasks.filter((t) => t.assignee?.id === currentUser.id)
                          .length
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All your tasks
                  </p>
                </div>

                {/* In Progress */}
                <div className="rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">In Progress</p>
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    {currentUser
                      ? tasks.filter(
                          (t) =>
                            t.assignee?.id === currentUser.id &&
                            t.status === "In Progress",
                        ).length
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Actively working
                  </p>
                </div>

                {/* Overdue */}
                <div className="rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">Overdue</p>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                  <p className="text-3xl font-bold text-red-600">
                    {currentUser
                      ? tasks.filter((t) => {
                          const due = new Date(t.dueDate);
                          return (
                            t.assignee?.id === currentUser.id &&
                            due < NOW &&
                            t.status !== "Done"
                          );
                        }).length
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Need attention
                  </p>
                </div>

                {/* At Risk */}
                <div className="rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">At Risk</p>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-3xl font-bold text-amber-600">
                    {currentUser
                      ? tasks.filter(
                          (t) =>
                            t.assignee?.id === currentUser.id &&
                            t.status === "In Progress" &&
                            t.priority === "High",
                        ).length
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    High priority
                  </p>
                </div>
              </div>
            </div>

            {/* Completion Progress */}
            <div className="rounded-lg border border-border bg-white p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Completion Progress
              </h3>
              {currentUser &&
                (() => {
                  const myTasks = tasks.filter(
                    (t) => t.assignee?.id === currentUser.id,
                  );
                  const myDoneTasks = myTasks.filter(
                    (t) => t.status === "Done",
                  ).length;
                  const myTodoTasks = myTasks.filter(
                    (t) => t.status === "To Do",
                  ).length;
                  const myInProgressTasks = myTasks.filter(
                    (t) => t.status === "In Progress",
                  ).length;
                  const myReviewTasks = myTasks.filter(
                    (t) => t.status === "Review",
                  ).length;
                  const completionPct =
                    myTasks.length > 0
                      ? Math.round((myDoneTasks / myTasks.length) * 100)
                      : 0;

                  return (
                    <>
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            Overall Progress
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {completionPct}%
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
                            style={{ width: `${completionPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Status Breakdown */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="text-center p-3 rounded-lg bg-slate-50">
                          <p className="text-2xl font-bold text-slate-600">
                            {myTodoTasks}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            To Do
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-blue-50">
                          <p className="text-2xl font-bold text-blue-600">
                            {myInProgressTasks}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            In Progress
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-amber-50">
                          <p className="text-2xl font-bold text-amber-600">
                            {myReviewTasks}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Review
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-green-50">
                          <p className="text-2xl font-bold text-green-600">
                            {myDoneTasks}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Done
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                Quick Actions
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <Link
                  href="/my-work"
                  className="rounded-lg border border-border bg-white p-4 hover:shadow-sm hover:border-indigo-300 transition-all"
                >
                  <p className="text-sm font-medium text-foreground">
                    My Tasks
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    View all tasks
                  </p>
                </Link>
                <Link
                  href="/board"
                  className="rounded-lg border border-border bg-white p-4 hover:shadow-sm hover:border-indigo-300 transition-all"
                >
                  <p className="text-sm font-medium text-foreground">
                    Board View
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Kanban</p>
                </Link>
                <Link
                  href="/epics"
                  className="rounded-lg border border-border bg-white p-4 hover:shadow-sm hover:border-indigo-300 transition-all"
                >
                  <p className="text-sm font-medium text-foreground">
                    My Epics
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Assigned projects
                  </p>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
