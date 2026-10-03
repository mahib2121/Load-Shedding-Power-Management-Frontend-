import type { ReactNode } from "react";
import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { DashboardHeader } from "../_components/dashboard-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
