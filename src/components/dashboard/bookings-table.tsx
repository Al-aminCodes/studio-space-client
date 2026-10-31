"use client";

import { CalendarDays } from "lucide-react";
import type { Booking } from "./types";

type Props = {
  bookings: Booking[];
  onStatusChange: (id: string, status: Booking["status"]) => void;
};

export default function BookingsTable({ bookings, onStatusChange }: Props) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold sm:text-3xl">My Bookings</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Review reservations for your studios.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-bold">All reservations</h3>
          <span className="text-sm text-muted-foreground">
            {bookings.length} bookings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-4 font-medium">Studio</th>
                <th className="px-3 py-4 font-medium">Customer</th>
                <th className="px-3 py-4 font-medium">Date</th>
                <th className="px-3 py-4 font-medium">Amount</th>
                <th className="px-3 py-4 font-medium">Status</th>
                <th className="px-3 py-4 font-medium">Update</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-4 font-semibold">{booking.studio}</td>
                  <td className="px-3 py-4 text-muted-foreground">
                    {booking.customer}
                  </td>
                  <td className="px-3 py-4 text-muted-foreground">
                    {booking.date}
                  </td>
                  <td className="px-3 py-4 font-bold">${booking.amount}</td>
                  <td className="px-3 py-4">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <select
                      aria-label={`Booking ${booking.id} status`}
                      value={booking.status}
                      onChange={(event) =>
                        onStatusChange(
                          String(booking.id),
                          event.target.value as Booking["status"],
                        )
                      }
                      className="h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-accent"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <div className="py-12 text-center">
              <CalendarDays className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No bookings available yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
