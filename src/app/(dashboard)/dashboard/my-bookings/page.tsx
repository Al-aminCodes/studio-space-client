"use client";

import { useSession } from "@/lib/auth-client";
import {
  CalendarDays,
  Image as ImageIcon,
  Loader2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  title?: string;
  category?: string;
  hourlyRate?: number;
  location?: string;
  imageUrl?: string;
  userEmail?: string;
  bookingDate?: string;
  status: "Pending" | "Confirmed" | "Cancelled";
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyBookingsPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const userEmail = session?.user?.email;

  const loadBookings = useCallback(async () => {
    if (!userEmail || !API_URL) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/my-bookings/${encodeURIComponent(userEmail)}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Could not load bookings.");
      }

      const data = await response.json();

      const allBookings: Booking[] = Array.isArray(data)
        ? data
        : (data.bookings ?? []);

      setBookings(allBookings);
    } catch (error) {
      console.error("Load bookings error:", error);
      toast.error("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadBookings();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [sessionLoading, session?.user, loadBookings]);

  const handleCancel = async (booking: Booking) => {
    if (!API_URL) {
      toast.error("Server URL is not configured.");
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete your booking for "${booking.studioTitle || booking.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setCancellingId(booking._id);

      const response = await fetch(
        `${API_URL}/bookings-studios/${encodeURIComponent(booking._id)}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json().catch(() => null);

      // if (!response.ok) {
      //   throw new Error(result?.message || "Could not delete booking.");
      // }

      // Remove the deleted booking from the UI
      setBookings((previous) =>
        previous.filter((item) => item._id !== booking._id),
      );

      toast.success("Booking deleted successfully.");
    } catch (error) {
      console.error("Delete booking error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete booking.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "Date not provided";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Invalid date";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(parsed);
  };

  const getStatusClass = (status: Booking["status"]) => {
    switch (status) {
      case "Confirmed":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "Cancelled":
        return "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";
    }
  };

  if (sessionLoading || (session?.user && loading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background text-foreground">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-background p-6 text-center text-foreground">
        <CalendarDays size={40} className="text-muted-foreground" />
        <h1 className="text-xl font-bold">Please log in</h1>
        <p className="text-sm text-muted-foreground">
          Log in to view your reservations.
        </p>
        <Link
          href="/login"
          className="rounded-lg bg-[#ff6a00] px-5 py-2.5 text-primary-foreground"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Bookings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track and manage your studio reservations.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col justify-between gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-card-foreground">
                Booking History
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {bookings.length} reservation
                {bookings.length === 1 ? "" : "s"}
              </p>
            </div>
            <Link
              href="/studios"
              className="inline-flex items-center justify-center rounded-lg bg-[#ff6a00] px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              + Book More Studio
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <CalendarDays
                size={40}
                className="mx-auto mb-3 text-muted-foreground"
              />
              <h3 className="font-semibold">No bookings yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your studio reservations will appear here.
              </p>
              <Link
                href="/studios"
                className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Explore Studios
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-medium">Studio</th>
                    <th className="px-4 py-4 font-medium">Date & Time</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {booking.imageUrl ? (
                              <Image
                                src={booking.imageUrl}
                                alt={
                                  booking.studioTitle ||
                                  booking.title ||
                                  "Studio"
                                }
                                fill
                                unoptimized
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ImageIcon
                                  size={18}
                                  className="text-muted-foreground"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-56 truncate font-semibold text-card-foreground">
                              {booking.studioTitle || booking.title || "Studio"}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {booking.category || "Studio reservation"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarDays size={16} />
                          <span>{formatDate(booking.bookingDate)}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(booking.status)}`}
                        >
                          {booking.status || "Pending"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        {booking.status !== "Cancelled" ? (
                          <button
                            onClick={() => handleCancel(booking)}
                            disabled={cancellingId === booking._id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400"
                          >
                            {cancellingId === booking._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
