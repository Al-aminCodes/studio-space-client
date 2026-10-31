"use client";

import { UserRound, Mail, ShieldCheck } from "lucide-react";
import type { DashboardUser } from "./types";

export default function ProfileSection({ user }: { user: DashboardUser }) {
  const initial = user.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold sm:text-3xl">My Profile</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your signed-in StudioSpace account information.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-28 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="size-24 rounded-2xl border-4 border-card object-cover shadow-md"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-2xl border-4 border-card bg-accent/10 text-3xl font-extrabold text-accent shadow-md">
                {initial}
              </div>
            )}

            <div className="pb-1">
              <h3 className="text-xl font-bold">
                {user.name || "StudioSpace Member"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                StudioSpace account
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <div className="flex items-start gap-4 rounded-xl border border-border p-4">
              <span className="rounded-lg bg-accent/10 p-2 text-accent">
                <UserRound className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Full name</p>
                <p className="mt-1 break-words text-sm font-semibold">
                  {user.name || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-border p-4">
              <span className="rounded-lg bg-accent/10 p-2 text-accent">
                <Mail className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email address</p>
                <p className="mt-1 break-all text-sm font-semibold">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-border p-4">
              <span className="rounded-lg bg-accent/10 p-2 text-accent">
                <ShieldCheck className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Account ID</p>
                <p className="mt-1 break-all font-mono text-xs font-medium">
                  {user.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
