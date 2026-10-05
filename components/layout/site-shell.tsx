"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
