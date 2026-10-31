"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

import Sidebar from "@/components/second-layout/sidebar";
import DashboardHeader from "@/components/second-layout/dashboard-header";

import DashboardOverview from "@/components/dashboard/overview";
import StudioListings from "@/components/dashboard/studio-listings";
import BookingsTable from "@/components/dashboard/bookings-table";
import ProfileSection from "@/components/dashboard/profile-section";
import StudioForm from "@/components/dashboard/studio-form";

import type {
  Booking,
  DashboardSection,
  DashboardUser,
  Studio,
} from "@/components/dashboard/types";

const initialStudios: Studio[] = [
  {
    id: 1,
    name: "Lumiere Photo Studio",
    category: "Photo Studio",
    location: "Brooklyn, NY",
    price: 45,
    status: "Active",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600",
    rating: 4.9,
  },
  {
    id: 2,
    name: "The Grid Sound Stage",
    category: "Film Stage",
    location: "Los Angeles, CA",
    price: 120,
    status: "Active",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600",
    rating: 4.8,
  },
  {
    id: 3,
    name: "The Pod Lounge",
    category: "Podcast Room",
    location: "Austin, TX",
    price: 35,
    status: "Pending",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600",
    rating: 4.7,
  },
];

const initialBookings: Booking[] = [
  {
    id: 101,
    studio: "Lumiere Photo Studio",
    customer: "Sarah Johnson",
    date: "Oct 31, 2026",
    amount: 180,
    status: "Confirmed",
  },
  {
    id: 102,
    studio: "The Grid Sound Stage",
    customer: "Alex Carter",
    date: "Nov 02, 2026",
    amount: 360,
    status: "Pending",
  },
  {
    id: 103,
    studio: "The Pod Lounge",
    customer: "Emily Davis",
    date: "Nov 05, 2026",
    amount: 105,
    status: "Confirmed",
  },
];

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  const [activePage, setActivePage] = useState<DashboardSection>("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [studios, setStudios] = useState<Studio[]>(initialStudios);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);

  const sessionUser = session?.user;

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-2xl font-bold">Please sign in</h1>
        <p className="text-sm text-muted-foreground">
          You need to sign in to access your StudioSpace dashboard.
        </p>
        <Link
          href="/login"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white hover:opacity-90"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const user: DashboardUser = {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    image: sessionUser.image,
  };

  function navigateTo(page: DashboardSection) {
    setActivePage(page);
    setMobileOpen(false);

    if (page !== "Add New Studio") {
      setEditingStudio(null);
    }
  }

  function startEditing(studio: Studio) {
    setEditingStudio(studio);
    setActivePage("Add New Studio");
    setMobileOpen(false);
  }

  function handleStudioSubmit(data: {
    name: string;
    category: string;
    location: string;
    price: number;
    image: string;
  }) {
    if (editingStudio) {
      setStudios((current) =>
        current.map((studio) =>
          studio.id === editingStudio.id ? { ...studio, ...data } : studio,
        ),
      );

      toast.success("Studio updated in this demo.");
    } else {
      setStudios((current) => [
        {
          id: Date.now(),
          ...data,
          status: "Pending",
          rating: 0,
        },
        ...current,
      ]);

      toast.success("Studio added to this demo.");
    }

    setEditingStudio(null);
    setActivePage("My Studio Listings");
  }

  function deleteStudio(id: number) {
    const studio = studios.find((item) => item.id === id);
    if (!studio) return;

    if (!window.confirm(`Delete "${studio.name}"?`)) return;

    setStudios((current) => current.filter((item) => item.id !== id));

    toast.success("Studio removed from this demo.");
  }

  function updateBookingStatus(id: number, status: Booking["status"]) {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id ? { ...booking, status } : booking,
      ),
    );

    toast.success(`Booking marked ${status.toLowerCase()}.`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        user={user}
        activePage={activePage}
        onNavigate={navigateTo}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <DashboardHeader
          title={activePage}
          user={user}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {activePage === "Overview" && (
            <DashboardOverview
              studios={studios}
              bookings={bookings}
              onNavigate={navigateTo}
              onEdit={startEditing}
            />
          )}

          {activePage === "Add New Studio" && (
            <StudioForm
              studio={editingStudio}
              onSubmit={handleStudioSubmit}
              onCancel={() => {
                setEditingStudio(null);
                setActivePage("My Studio Listings");
              }}
            />
          )}

          {activePage === "My Studio Listings" && (
            <StudioListings
              studios={studios}
              onAdd={() => {
                setEditingStudio(null);
                setActivePage("Add New Studio");
              }}
              onEdit={startEditing}
              onDelete={deleteStudio}
            />
          )}

          {activePage === "My Bookings" && (
            <BookingsTable
              bookings={bookings}
              onStatusChange={updateBookingStatus}
            />
          )}

          {activePage === "Profile" && <ProfileSection user={user} />}
        </main>
      </div>
    </div>
  );
}
