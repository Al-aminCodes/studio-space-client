"use client";

import Sidebar from "@/components/second-layout/sidebar";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={{} as React.ComponentProps<typeof Sidebar>["user"]}
        activePage={"dashboard" as React.ComponentProps<typeof Sidebar>["activePage"]}
        onNavigate={() => {}}
      />

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 sm:px-6">
          <button
            type="button"
            aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md border border-border p-2 hover:bg-muted lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div>
            <h1 className="text-base font-semibold">StudioSpace Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              Manage your studio workspace
            </p>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
