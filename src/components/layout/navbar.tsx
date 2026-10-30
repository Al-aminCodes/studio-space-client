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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "@/lib/auth-client";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

const dashboardLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Add New Studio",
    href: "/add-studio",
    icon: PlusCircle,
  },
  {
    label: "My Studio Listings",
    href: "/my-studios",
    icon: Building2,
  },
  {
    label: "My Bookings",
    href: "/my-bookings",
    icon: CalendarDays,
  },
];
type ProfileMenuProps = {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
  loggingOut: boolean;
  onLogout: () => void;
};

function ProfileMenu({ user, loggingOut, onLogout }: ProfileMenuProps) {
  const pathname = usePathname();

  const displayName = user.name?.trim() || "User";
  const initials =
    displayName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const dashboardLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Add New Studio", href: "/add-studio", icon: PlusCircle },
    { label: "My Studio Listings", href: "/my-studios", icon: Building2 },
    { label: "My Bookings", href: "/my-bookings", icon: CalendarDays },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          className="flex h-auto items-center gap-2 rounded-full px-2 py-1.5"
          aria-label="Open profile menu"
        >
          <Avatar className="size-9 border border-border">
            <AvatarImage src={user.image || undefined} alt={displayName} />
            <AvatarFallback className="bg-accent/10 text-accent">
              {initials}
            </AvatarFallback>
          </Avatar>

          <span className="hidden max-w-28 truncate text-sm font-semibold xl:block">
            {displayName}
          </span>

          <ChevronDown className="hidden size-4 xl:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-64">
        <DropdownMenuLabel>
          <p className="font-semibold">{displayName}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {dashboardLinks.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem
            key={href}
            className={
              pathname === href || pathname.startsWith(`${href}/`)
                ? "bg-accent/10 text-accent"
                : ""
            }
          >
            <Link href={href}>
              <Icon className="mr-2 size-4" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={loggingOut}
          onSelect={(event) => {
            event.preventDefault();
            onLogout();
          }}
          className="cursor-pointer text-destructive"
        >
          {loggingOut ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 size-4" />
          )}
          {loggingOut ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    if (href === "/studios") {
      return pathname === "/studios" || pathname.startsWith("/studios/");
    }

    return false;
  };

  const isDashboardActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully.");
            setMobileOpen(false);
            router.replace("/login");
            router.refresh();
          },
        },
      });
    } catch {
      toast.error("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  const displayName = user?.name?.trim() || "User";
  const initials =
    displayName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

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
              <Button
                variant="ghost"
                className="text-foreground hover:bg-surface hover:text-accent"
              >
                <Link href="/login">Log In</Link>
              </Button>

              <Button className="bg-accent font-semibold text-white transition-colors hover:bg-[#E85F00]">
                <Link href="/signup">Register</Link>
              </Button>
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

            {!isPending && (
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                {isAuthenticated ? (
                  <>
                    {dashboardLinks.map(({ label, href }) => (
                      <Button
                        key={href}
                        variant="outline"
                        className={`justify-start border-border bg-surface ${
                          isDashboardActive(href) ? "text-accent" : ""
                        }`}
                      >
                        <Link href={href} onClick={() => setMobileOpen(false)}>
                          {label}
                        </Link>
                      </Button>
                    ))}

                    <Button
                      variant="destructive"
                      className="col-span-2 w-full"
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
                    <Button
                      variant="outline"
                      className="w-full border-border bg-surface text-foreground"
                    >
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        Log In
                      </Link>
                    </Button>

                    <Button className="w-full bg-accent font-semibold text-white hover:bg-[#E85F00]">
                      <Link href="/signup" onClick={() => setMobileOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
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
