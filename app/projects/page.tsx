"use client";

import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PROJECTS } from "@/lib/mock";
import { FolderOpen } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs items={[{ label: "Projects" }]} />
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Page heading */}
        <div className="flex items-center gap-3">
          <FolderOpen className="h-6 w-6 text-indigo-600" />
          <div>
            <h1 className="text-xl font-bold text-foreground">All Projects</h1>
            <p className="text-sm text-muted-foreground">
              Browse and manage all projects in your workspace
            </p>
          </div>
        </div>

        {/* Projects list */}
        <div className="space-y-3">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
