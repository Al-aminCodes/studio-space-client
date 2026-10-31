"use client";

import { useState } from "react";
import BookingsTable from "@/components/dashboard/bookings-table";
import type { Booking } from "@/components/dashboard/types";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const handleStatusChange = (bookingId: string, status: Booking["status"]) => {
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        String(booking.id) === bookingId ? { ...booking, status } : booking,
      ),
    );
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">My Bookings</h1>

      <BookingsTable bookings={bookings} onStatusChange={handleStatusChange} />
    </div>
  );
}
