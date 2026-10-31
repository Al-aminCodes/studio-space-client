"use client";

import { Menu, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { DashboardUser } from "@/components/dashboard/types";
import { toast } from "sonner";

type Props = {
  title: string;
  user: DashboardUser;
  onMenuClick: () => void;
};

export default function DashboardHeader({ title, user, onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-lg border border-border p-2 hover:bg-muted lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold sm:text-base">{title}</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Welcome back, {user.name || "StudioSpace Member"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <button
          type="button"
          aria-label="Notifications"
          onClick={() => toast.info("You're all caught up!")}
          className="relative rounded-xl border border-border p-2.5 hover:bg-muted"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
        </button>

        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "Profile"}
            className="size-9 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="flex size-9 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
            {(user.name?.trim().charAt(0) || "U").toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
