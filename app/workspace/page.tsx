import { Users } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PROJECT, USERS, PROJECT_MEMBERS } from "@/lib/mock";

const ROLE_BADGE: Record<string, string> = {
  Admin:   "bg-indigo-100 text-indigo-700",
  Manager: "bg-blue-100 text-blue-700",
  Member:  "bg-green-100 text-green-700",
  Viewer:  "bg-slate-100 text-slate-600",
};

export default function WorkspacePage() {
  const memberIds = PROJECT_MEMBERS[PROJECT.id] ?? [];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumbs
          items={[{ label: PROJECT.name, href: "/dashboard" }, { label: "Workspace" }]}
        />
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-indigo-600" />
          <h1 className="text-xl font-bold text-foreground">Workspace Members</h1>
        </div>

        <div className="max-w-lg space-y-2">
          {USERS.map((user) => {
            const isMember = memberIds.includes(user.id);
            return (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3"
              >
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.initials}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.id}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE[user.role]}`}>
                  {user.role}
                </span>
                {isMember && (
                  <span className="text-xs text-muted-foreground">Project member</span>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Invite, role management, and deprovisioning are post-MVP features.
        </p>
      </div>
    </div>
  );
}
