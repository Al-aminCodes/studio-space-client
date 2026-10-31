"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Aperture,
  Menu,
  X,
  UserRound,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  LogOut,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "@/lib/auth-client";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

const dashboardLinks = [
  { label: "Dashboard", href: "/deshboard", icon: LayoutDashboard },
  { label: "Add New Studio", href: "/add-studio", icon: PlusCircle },
  { label: "My Studio Listings", href: "/my-studios", icon: Building2 },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarDays },
];

type User = {
  name?: string | null;
  email: string;
  image?: string | null;
};

type ProfileMenuProps = {
  user: User;
  loggingOut: boolean;
  onLogout: () => void;
};

function ProfileMenu({ user, loggingOut, onLogout }: ProfileMenuProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user.name?.trim() || "User";
  const initials =
    displayName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div
      className="relative"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <button
        type="button"
        aria-label="Open profile menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="flex h-auto items-center gap-2 rounded-full border border-border px-2 py-1.5 transition hover:border-accent"
      >
        <Avatar className="size-9">
          <AvatarImage src={user.image || undefined} alt={displayName} />
          <AvatarFallback className="bg-gray-100 text-gray-900">
            {initials}
          </AvatarFallback>
        </Avatar>

        <span className="hidden max-w-28 truncate text-sm font-semibold xl:block">
          {displayName}
        </span>

        <ChevronDown className="hidden size-4 xl:block" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 w-64 pt-2">
          <div className="rounded-xl border border-gray-200 bg-white p-3 text-gray-900 shadow-xl">
            <div className="flex items-center gap-3">
              <Avatar className="size-11 shrink-0">
                <AvatarImage src={user.image || undefined} alt={displayName} />
                <AvatarFallback className="bg-gray-100 text-gray-900">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate font-semibold text-black">
                  {displayName}
                </p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="my-3 border-t border-gray-200" />

            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-gray-100 hover:text-orange-600 ${
                pathname === "/profile"
                  ? "bg-gray-100 text-orange-600"
                  : "text-gray-800"
              }`}
            >
              <UserRound className="size-4" />
              My Profile
            </Link>

            {dashboardLinks.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-gray-100 hover:text-orange-600 ${
                    active ? "bg-gray-100 text-orange-600" : "text-gray-800"
                  }`}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}

            <div className="my-3 border-t border-gray-200" />

            <button
              type="button"
              disabled={loggingOut}
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;
  const isAuthenticated = Boolean(user);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    if (href.startsWith("/#")) return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await signOut();

      setMobileOpen(false);
      toast.success("Logged out successfully.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 text-foreground shadow-sm backdrop-blur-xl">
      <nav className="container-page flex min-h-16 items-center justify-between gap-4 py-3 sm:min-h-20">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="StudioSpace home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
            <Aperture className="size-7 text-accent" />
          </span>

          <span className="font-heading text-lg font-extrabold tracking-tight sm:text-xl">
            Studio<span className="text-accent">Space</span>
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
                className={`relative whitespace-nowrap py-2 text-sm transition-colors ${
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
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <ThemeToggle />

          {isPending ? (
            <div className="size-9 animate-pulse rounded-full bg-surface" />
          ) : user ? (
            <ProfileMenu
              user={user}
              loggingOut={loggingOut}
              onLogout={() => void handleLogout()}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 items-center justify-center rounded-md border border-border text-sm font-medium"
                >
                  Log In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 items-center justify-center rounded-md bg-accent text-sm font-semibold text-white hover:bg-[#E85F00]"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <ThemeToggle />

          {!isPending && user && (
            <ProfileMenu
              user={user}
              loggingOut={loggingOut}
              onLogout={() => void handleLogout()}
            />
          )}

          <Button
            type="button"
            variant="outline"
            size="icon"
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

      {/* Mobile navigation */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 md:hidden ${
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border bg-background px-4 pb-5 pt-3">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm transition-colors ${
                    isActive(link.href)
                      ? "bg-accent/10 font-semibold text-accent"
                      : "hover:bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {!isPending && (
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                {isAuthenticated ? (
                  <>
                    {dashboardLinks.map(({ label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`rounded-lg border border-border bg-surface px-3 py-3 text-sm transition hover:border-accent ${
                          isActive(href) ? "text-accent" : ""
                        }`}
                      >
                        {label}
                      </Link>
                    ))}

                    <Button
                      variant="destructive"
                      className="col-span-2"
                      disabled={loggingOut}
                      onClick={() => void handleLogout()}
                    >
                      {loggingOut ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 size-4" />
                      )}
                      {loggingOut ? "Logging out..." : "Logout"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent/10"
                    >
                      Log In
                    </Link>

                    <Link
                      href="/register"
                      className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-[#E85F00]"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
