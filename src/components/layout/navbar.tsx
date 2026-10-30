"use client";

import { Button } from "@/components/ui/button";
import { Aperture, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/studios") return pathname.startsWith("/studios");
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 text-foreground shadow-sm backdrop-blur-xl transition-colors duration-300">
      <nav className="container-page flex min-h-16 items-center justify-between gap-4 py-3 sm:min-h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="StudioSpace home"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
            <Aperture className="size-7 text-accent" />
          </span>

          <span className="font-heading text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
            Studio
            <span className="text-accent">Space</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap py-2 text-sm transition-colors duration-200 ${
                  active
                    ? "font-semibold text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}

                {active && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 md:flex lg:gap-3">
          <ThemeToggle />

          <Button
            variant="ghost"
            className="text-foreground hover:bg-surface hover:text-accent"
          >
            <Link href="/login">Log In</Link>
          </Button>

          <Button className="bg-accent font-semibold text-white transition-colors hover:bg-[#E85F00]">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <ThemeToggle />

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-border bg-surface text-foreground hover:bg-border"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Responsive mobile menu */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out md:hidden ${
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border bg-background px-4 pb-5 pt-3 sm:px-6">
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm transition-colors ${
                      active
                        ? "bg-accent/10 font-semibold text-accent"
                        : "text-foreground hover:bg-surface"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <Button
                variant="outline"
                className="w-full border-border bg-surface text-foreground hover:bg-border"
              >
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Log In
                </Link>
              </Button>

              <Button className="w-full bg-accent font-semibold text-white hover:bg-[#E85F00]">
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
