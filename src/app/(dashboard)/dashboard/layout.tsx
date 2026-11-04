"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/auth-client";

import Sidebar from "@/components/second-layout/sidebar";
import DashboardHeader from "@/components/second-layout/dashboard-header";
import type { DashboardUser } from "@/components/dashboard/types";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-2xl font-bold">Please sign in</h1>

        <p className="text-sm text-muted-foreground">
          You need to sign in to access your StudioSpace dashboard.
        </p>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const user: DashboardUser = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        user={user}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <DashboardHeader
          title="StudioSpace Dashboard"
          user={user}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
