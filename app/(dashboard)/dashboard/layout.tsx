import type { ReactNode } from "react";
import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { DashboardHeader } from "../_components/dashboard-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="min-h-screen md:pl-64">
        <DashboardHeader />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
