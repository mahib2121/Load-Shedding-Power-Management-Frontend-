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

const commonItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

export const roleNavigation: Record<UserRole, NavItem[]> = {
  CUSTOMER: [
    ...commonItems,
    {
      title: "Load Shedding",
      href: "/dashboard/schedules",
      icon: CalendarDays,
    },
    {
      title: "Outages",
      href: "/dashboard/outages",
      icon: Zap,
    },
    {
      title: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ],
  FIELD_OPERATOR: [
    ...commonItems,
    {
      title: "Assignments",
      href: "/dashboard/assignments",
      icon: ClipboardList,
    },
    {
      title: "Outage Management",
      href: "/dashboard/outages",
      icon: Zap,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ],
  ZONE_MANAGER: [
    ...commonItems,
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
    {
      title: "Team",
      href: "/dashboard/team",
      icon: Users,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ],

  SUPER_ADMIN: [
    ...commonItems,
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
      title: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ],
};
