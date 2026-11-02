"use client";

import { authClient, signOut, useSession } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Pencil,
  X,
  Check,
  LogOut,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [name, setName] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSave = async () => {
    const trimmedName = editName.trim();

    if (trimmedName.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
      });

      if (error) {
        throw new Error(error.message || "Could not update your profile.");
      }

      setName(trimmedName);
      setEditName(trimmedName);
      setIsEditing(false);

      toast.success("Profile updated successfully.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <Loader2 className="h-7 w-7 animate-spin text-[var(--accent)]" />
        <span className="ml-3 text-sm text-[var(--muted)]">
          Loading profile...
        </span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[var(--background)] px-4 text-center text-[var(--foreground)]">
        <UserRound className="h-12 w-12 text-[var(--accent)]" />
        <h2 className="text-xl font-bold">Please sign in</h2>
        <p className="text-sm text-[var(--muted)]">
          Sign in to view your profile.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const email = session.user.email ?? "";
  const displayName = name ?? session.user.name ?? "";
  const avatar = session.user.image;

  const initials = (displayName || email || "U")
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--background)] p-4 text-[var(--foreground)] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Account Settings
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
            Manage your personal information and account.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-black/10">
          <div className="h-2 bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-amber-400" />

          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--accent)] bg-[var(--background)] text-2xl font-bold text-[var(--accent)]">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="break-words text-2xl font-bold">
                {displayName || "Your Name"}
              </h2>
              <p className="mt-1 break-all text-sm text-[var(--muted)]">
                {email}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
                <ShieldCheck className="h-4 w-4" />
                Account Active
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => {
                  setEditName(displayName);
                  setIsEditing(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
              >
                <Pencil className="h-4 w-4 text-[var(--accent)]" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="border-t border-[var(--border)] p-6 sm:p-8">
            <h3 className="mb-6 text-lg font-semibold">Personal Information</h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-medium text-[var(--muted)]"
                >
                  Full Name
                </label>

                {isEditing ? (
                  <input
                    id="profile-name"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    maxLength={100}
                    autoComplete="name"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex min-h-12 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                    <UserRound className="h-5 w-5 shrink-0 text-[var(--accent)]" />
                    <span className="break-words text-sm text-[var(--foreground)]">
                      {displayName || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
                  Email Address
                </label>
                <div className="flex min-h-12 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                  <Mail className="h-5 w-5 shrink-0 text-[var(--accent)]" />
                  <span className="break-all text-sm text-[var(--foreground)]">
                    {email || "Not provided"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Your email address is read-only here.
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={() => {
                    setEditName(displayName);
                    setIsEditing(false);
                  }}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--background)] disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-red-500/20 bg-[var(--surface)] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">
                Sign out
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Sign out of your StudioSpace account on this device.
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              {isLoggingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
