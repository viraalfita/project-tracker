"use client";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProjectDocsTab } from "@/components/projects/ProjectDocsTab";
import { ProjectEpicsTab } from "@/components/projects/ProjectEpicsTab";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectMembersTab } from "@/components/projects/ProjectMembersTab";
import { getEpicsByProject, getProjectById } from "@/lib/mock";
import { notFound } from "next/navigation";
import { use, useState } from "react";

type Tab = "epics" | "docs" | "members";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = use(params);
  const project = getProjectById(projectId);
  if (!project) notFound();

  const epics = getEpicsByProject(project.id);
  const [activeTab, setActiveTab] = useState<Tab>("epics");

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "epics", label: "Epics", count: epics.length },
    { id: "docs", label: "Docs" },
    { id: "members", label: "Members", count: project.memberIds.length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: project.name },
          ]}
        />
      </div>

      <div className="flex-1 px-6 py-6 space-y-5">
        <ProjectHeader project={project} />

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
        {activeTab === "epics" && <ProjectEpicsTab epics={epics} />}
        {activeTab === "docs" && <ProjectDocsTab />}
        {activeTab === "members" && (
          <ProjectMembersTab memberIds={project.memberIds} />
        )}
      </div>
    </div>
  );
}
