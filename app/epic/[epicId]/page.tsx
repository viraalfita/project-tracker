"use client";

import { EpicDocsTab } from "@/components/epic/EpicDocsTab";
import { EpicHeader } from "@/components/epic/EpicHeader";
import { EpicTasksTab } from "@/components/epic/EpicTasksTab";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EPICS, getProjectById, getTasksByEpic } from "@/lib/mock";
import { notFound } from "next/navigation";
import { use, useState } from "react";

type Tab = "tasks" | "docs";

interface EpicPageProps {
  params: Promise<{ epicId: string }>;
}

export default function EpicPage({ params }: EpicPageProps) {
  const { epicId } = use(params);
  const epic = EPICS.find((e) => e.id === epicId);
  if (!epic) notFound();

  const project = getProjectById(epic.projectId);
  if (!project) notFound();

  const tasks = getTasksByEpic(epic.id);
  const [activeTab, setActiveTab] = useState<Tab>("tasks");

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "tasks", label: "Tasks", count: tasks.length },
    { id: "docs", label: "Docs" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: project.name, href: `/projects/${project.id}` },
            { label: epic.title },
          ]}
        />
      </div>

      <div className="flex-1 px-6 py-6 space-y-5">
        <EpicHeader epic={epic} />

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-700"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "tasks" && (
          <EpicTasksTab tasks={tasks} epicId={epic.id} />
        )}
        {activeTab === "docs" && <EpicDocsTab />}
      </div>
    </div>
  );
}
