import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "../providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./(auth)/_features/auth.provider";
import { SiteShell } from "@/components/layout/site-shell";
// import { SiteShell } from "@/componenets/layout/site-shell";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Load Shedding & Power Management",
  description: "Load shedding and power management system",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        raleway.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <SiteShell>{children}</SiteShell>
            </AuthProvider>

            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
