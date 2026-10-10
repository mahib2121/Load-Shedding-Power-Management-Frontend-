import {
  LayoutDashboard,
  CalendarDays,
  Zap,
  ClipboardList,
  CreditCard,
  Users,
  Map,
  UserRound,
  Settings,
} from "lucide-react";

import type { UserRole } from "@/app/(auth)/_features/auth.types";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

export type NavSection = {
  label?: string;
  items: NavItem[];
};

const overview: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

const operations: NavItem[] = [
  {
    title: "Schedules",
    href: "/dashboard/schedules",
    icon: CalendarDays,
  },
  {
    title: "Outages",
    href: "/dashboard/outages",
    icon: Zap,
  },
  {
    title: "Assignments",
    href: "/dashboard/assignments",
    icon: ClipboardList,
  },
];

const management: NavItem[] = [
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Zones",
    href: "/dashboard/zones",
    icon: Map,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
];

const account: NavItem[] = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const roleNavigation: Record<UserRole, NavSection[]> = {
  CUSTOMER: [
    { items: overview },
    { label: "Power", items: operations.filter((i) => i.href !== "/dashboard/assignments") },
    { label: "Account", items: [
      { title: "Payments", href: "/dashboard/payments", icon: CreditCard },
      ...account,
    ] },
  ],
  FIELD_OPERATOR: [
    { items: overview },
    { label: "Field", items: operations.filter((i) => i.href !== "/dashboard/schedules" && i.href !== "/dashboard/zones") },
    { label: "Account", items: [account[0]] },
  ],
  ZONE_MANAGER: [
    { items: overview },
    { label: "Operations", items: operations },
    { label: "Management", items: management.filter((i) => i.href === "/dashboard/team") },
    { label: "Account", items: [account[0]] },
  ],
  SUPER_ADMIN: [
    { items: overview },
    { label: "Operations", items: operations },
    { label: "Management", items: management },
    { label: "Account", items: account },
  ],
};
