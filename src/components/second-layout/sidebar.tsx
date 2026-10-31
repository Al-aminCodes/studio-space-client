"use client";

import Link from "next/link";
import {
  Aperture,
  LayoutDashboard,
  Plus,
  Building2,
  CalendarDays,
  UserRound,
  Home,
  X,
} from "lucide-react";

import type {
  DashboardSection,
  DashboardUser,
} from "@/components/dashboard/types.ts";

type SidebarProps = {
  user: DashboardUser;
  activePage: DashboardSection;
  onNavigate: (page: DashboardSection) => void;
  mobileOpen: boolean;
  onClose: () => void;
};

const links: {
  label: DashboardSection;
  icon: typeof LayoutDashboard;
}[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Add New Studio", icon: Plus },
  { label: "My Studio Listings", icon: Building2 },
  { label: "My Bookings", icon: CalendarDays },
  { label: "Profile", icon: UserRound },
];

function getInitials(name?: string | null) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

export default function Sidebar({
  user,
  activePage,
  onNavigate,
  mobileOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-border px-5">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
              <Aperture className="size-6 text-accent" />
            </span>

            <span className="text-lg font-extrabold">
              Studio<span className="text-accent">Space</span>
            </span>
          </Link>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 pb-3 pt-7">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ label, icon: Icon }) => {
            const active = activePage === label;

            return (
              <button
                key={label}
                type="button"
                onClick={() => onNavigate(label)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-accent text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={() => onNavigate("Profile")}
            className="flex w-full items-center gap-3 rounded-xl bg-muted/60 p-3 text-left"
          >
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="size-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                {getInitials(user.name)}
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                {user.name || "StudioSpace Member"}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>
          </button>

          <Link
            href="/"
            onClick={onClose}
            className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Home className="size-4" />
            Back to website
          </Link>
        </div>
      </aside>
    </>
  );
}
