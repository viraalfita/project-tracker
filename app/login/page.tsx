"use client";

import { useState } from "react";
import { FolderKanban, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { USERS } from "@/lib/mock";
import { User, Role } from "@/lib/types";

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  Admin:   "Full access — create, edit, manage everything.",
  Manager: "Read-only overview of all projects and utilization.",
  Member:  "Create & edit tasks in assigned projects.",
  Viewer:  "Read-only — no editing anywhere.",
};

const ROLE_COLORS: Record<Role, { bg: string; border: string; badge: string; ring: string }> = {
  Admin:   { bg: "hover:bg-indigo-50", border: "border-border hover:border-indigo-400", badge: "bg-indigo-100 text-indigo-700", ring: "ring-indigo-400" },
  Manager: { bg: "hover:bg-blue-50",   border: "border-border hover:border-blue-400",   badge: "bg-blue-100 text-blue-700",   ring: "ring-blue-400" },
  Member:  { bg: "hover:bg-green-50",  border: "border-border hover:border-green-400",  badge: "bg-green-100 text-green-700", ring: "ring-green-400" },
  Viewer:  { bg: "hover:bg-slate-50",  border: "border-border hover:border-slate-400",  badge: "bg-slate-100 text-slate-600", ring: "ring-slate-400" },
};

export default function LoginPage() {
  // ── Root cause fix ──────────────────────────────────────────────────────────
  // Do NOT call router.push() here. Calling login() queues a React state update
  // (setCurrentUser). If router.push fires in the same tick, Next.js starts
  // rendering the new route before that update commits, so AppShell sees
  // currentUser===null and immediately redirects back to /login.
  //
  // Instead: just call login(user). AppShell's useEffect already watches
  // currentUser and calls router.replace("/dashboard") once it is set.
  // ────────────────────────────────────────────────────────────────────────────
  const { login } = useAuth();
  const [signingIn, setSigningIn] = useState<string | null>(null);

  function handleLogin(user: User) {
    if (signingIn) return; // prevent double-click
    setSigningIn(user.id);
    login(user);
    // Navigation is handled by AppShell's useEffect after currentUser commits.
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-600 mb-4 shadow-md">
            <FolderKanban className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Project Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Demo login — pick a role to explore the UI
          </p>
        </div>

        {/* User cards */}
        <div className="grid grid-cols-2 gap-3">
          {USERS.map((user) => {
            const colors = ROLE_COLORS[user.role];
            const isActive = signingIn === user.id;

            return (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                disabled={!!signingIn}
                className={[
                  "group rounded-xl border-2 bg-white p-5 text-left transition-all",
                  "disabled:cursor-not-allowed",
                  colors.bg,
                  colors.border,
                  isActive ? `ring-2 ${colors.ring} border-transparent` : "",
                ].join(" ")}
              >
                {/* Avatar + spinner */}
                <div className="relative mb-3 inline-flex">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      user.initials
                    )}
                  </span>
                </div>

                {/* Name + email */}
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground mb-1">{user.email}</p>

                {/* Role badge */}
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}>
                  {user.role}
                </span>

                {/* Description */}
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {ROLE_DESCRIPTIONS[user.role]}
                </p>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          No real authentication — state resets on page refresh
        </p>
      </div>
    </div>
  );
}
