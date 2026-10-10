"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { DashboardHeader } from "../_components/dashboard-header";
import { MobileSidebar } from "../_components/mobile-sidebar";

interface DashboardShellContextValue {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

const DashboardShellContext = createContext<DashboardShellContextValue | null>(
  null,
);

export function useDashboardShell() {
  const ctx = useContext(DashboardShellContext);
  if (!ctx) {
    throw new Error(
      "useDashboardShell must be used inside DashboardLayout",
    );
  }
  return ctx;
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <DashboardShellContext.Provider
      value={{ mobileNavOpen, setMobileNavOpen }}
    >
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <DashboardSidebar />
        <MobileSidebar open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
        <div className="min-h-screen md:pl-64">
          <DashboardHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
          <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardShellContext.Provider>
  );
}
