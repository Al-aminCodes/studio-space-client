"use client";

import { useRouter } from "next/navigation";
import DashboardOverview from "@/components/dashboard/overview";
import type {
  Booking,
  Studio,
  DashboardSection,
} from "@/components/dashboard/types";

export default function DashboardPage() {
  const router = useRouter();

  // Temporary demo data — পরে API থেকে fetch করবে
  const studios: Studio[] = [];
  const bookings: Booking[] = [];

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
    // TODO: Edit studio route/dialog implement করবে
    console.log("Edit studio:", studio);
  };

  return (
    <DashboardOverview
      studios={studios}
      bookings={bookings}
      onNavigate={handleNavigate}
      onEdit={handleEdit}
    />
  );
}
