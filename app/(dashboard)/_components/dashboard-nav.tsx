"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { useAuth } from "@/app/(auth)/_features/auth.provider";
import { roleNavigation, type NavItem } from "../_config/navigation";

export function DashboardNav() {
  const pathname = usePathname();

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <DashboardNavSkeleton />;
  }

  if (!user) {
    return null;
  }

  const sections = roleNavigation[user.role];

  return (
    <nav className="space-y-6" aria-label="Dashboard">
      {sections.map((section, sectionIdx) => (
        <div key={section.label ?? `section-${sectionIdx}`}>
          {section.label && (
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.label}
            </p>
          )}

          <ul className="space-y-1">
            {section.items.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function NavLink({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const Icon = item.icon;

  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <li>
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        {isActive && (
          <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
        )}
        <Icon
          className={cn(
            "size-4 shrink-0 transition-colors",
            isActive
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        />
        <span className="flex-1 truncate">{item.title}</span>
      </Link>
    </li>
  );
}

function DashboardNavSkeleton() {
  return (
    <nav className="space-y-6" aria-label="Dashboard loading">
      {Array.from({ length: 3 }).map((_, group) => (
        <div key={group} className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-muted/70"
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
