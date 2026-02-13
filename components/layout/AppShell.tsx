"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { QuickAddButton } from "@/components/shared/QuickAddButton";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser && pathname !== "/login") {
      router.replace("/login");
    }
    if (currentUser && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [currentUser, pathname, router]);

  // Login page — render with no sidebar
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Not yet authenticated — blank while redirect is in flight
  if (!currentUser) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <QuickAddButton />
    </div>
  );
}
