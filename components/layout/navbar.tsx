"use client";

import Link from "next/link";
import { ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/app/(auth)/_features/auth.provider";

export function Navbar() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg">⚡</span>
          </div>
          <span className="hidden sm:inline">Power Management</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/load-shedding"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Load Shedding
          </Link>
          <Link
            href="/outages"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Outages
          </Link>
        </nav>

        {!isLoading && (
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden max-w-32 truncate sm:inline">
                        {user.name}
                      </span>
                      <ChevronDown className="size-4" />
                    </Button>
                  }
                />

                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem render={<Link href="/dashboard" />}>
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
                    <User className="mr-2 size-4" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => void logout()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" render={<Link href="/login" />}>
                  Login
                </Button>
                <Button render={<Link href="/register" />}>Register</Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
