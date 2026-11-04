"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardOverview from "@/components/dashboard/overview";
import type {
  Booking,
  DashboardSection,
  Studio,
} from "@/components/dashboard/types";

import { authClient, useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = useSession();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user?.email) {
      return;
    }

    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Get authentication token
        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Unable to get authentication token.");
        }

        const token = data.token;
        const email = encodeURIComponent(session.user.email);

        // Fetch studios and bookings
        const [resStudios, resBookings] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-listings/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }),

          fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }),
        ]);

        if (!resStudios.ok) {
          throw new Error("Failed to fetch studio listings.");
        }

        if (!resBookings.ok) {
          throw new Error("Failed to fetch bookings.");
        }

        const studioData = await resStudios.json();
        const bookingData = await resBookings.json();

        if (!isMounted) return;

        // Support both direct arrays and wrapped API responses
        const studioList = Array.isArray(studioData)
          ? studioData
          : (studioData.studios ?? studioData.data ?? []);

        const bookingList = Array.isArray(bookingData)
          ? bookingData
          : (bookingData.bookings ?? bookingData.data ?? []);

        setStudios(studioList);
        setBookings(bookingList);

        console.log("Studios:", studioList);
        console.log("Bookings:", bookingList);
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [sessionLoading, session?.user?.email]);

  const handleNavigate = (section: DashboardSection) => {
    const routes: Record<DashboardSection, string> = {
      Overview: "/dashboard",
      "Add New Studio": "/dashboard/add-studio",
      "My Studio Listings": "/dashboard/my-studios",
      "My Bookings": "/dashboard/my-bookings",
      Profile: "/dashboard/profile",
    };

    router.push(routes[section]);
  };

  const handleEdit = (studio: Studio) => {
    console.log("Edit studio:", studio);
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-500">{error}</p>

        <button
          onClick={() => router.refresh()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DashboardOverview
      studios={studios}
      bookings={bookings}
      onNavigate={handleNavigate}
      onEdit={handleEdit}
    />
  );
}
