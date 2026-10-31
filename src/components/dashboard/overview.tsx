"use client";

import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import type { Booking, DashboardSection, Studio } from "./types";

type Props = {
  studios: Studio[];
  bookings: Booking[];
  onNavigate: (page: DashboardSection) => void;
  onEdit: (studio: Studio) => void;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-emerald-500/10 text-emerald-600",
    Confirmed: "bg-emerald-500/10 text-emerald-600",
    Pending: "bg-amber-500/10 text-amber-600",
    Cancelled: "bg-red-500/10 text-red-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || "bg-muted text-muted-foreground"
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default function DashboardOverview({
  studios,
  bookings,
  onNavigate,
  onEdit,
}: Props) {
  const stats = [
    {
      label: "Total Studios",
      value: studios.length,
      detail: "Your studio listings",
      icon: Building2,
    },
    {
      label: "Total Bookings",
      value: bookings.length,
      detail: "Across your studios",
      icon: CalendarDays,
    },
    {
      label: "Confirmed",
      value: bookings.filter((b) => b.status === "Confirmed").length,
      detail: "Confirmed reservations",
      icon: CheckCircle2,
    },
    {
      label: "Pending Review",
      value: studios.filter((s) => s.status === "Pending").length,
      detail: "Awaiting approval",
      icon: Clock3,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back 👋</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Your workspace
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your studios.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("Add New Studio")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-white transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Add New Studio
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="size-5" />
                </span>
              </div>

              <p className="mt-4 text-3xl font-extrabold tabular-nums">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {stat.detail}
              </p>
            </article>
          );
        })}
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">Recent studio listings</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep track of the spaces you offer.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("My Studio Listings")}
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
          >
            View all <ArrowUpRight className="size-4" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {studios.slice(0, 3).map((studio) => (
            <article
              key={studio.id}
              className="flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center"
            >
              <img
                src={studio.image}
                alt={studio.name}
                className="h-32 w-full rounded-lg object-cover sm:size-20"
              />

              <div className="min-w-0 flex-1">
                <h4 className="font-semibold">{studio.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {studio.category} · {studio.location}
                </p>
                <p className="mt-2 text-sm font-bold">
                  {money(studio.price)}
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    / hour
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <StatusBadge status={studio.status} />
                <button
                  type="button"
                  onClick={() => onEdit(studio)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/10"
                >
                  Edit
                </button>
              </div>
            </article>
          ))}

          {studios.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No studios yet. Add your first studio to get started.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">Recent bookings</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Review your latest reservations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("My Bookings")}
            className="text-sm font-semibold text-accent hover:underline"
          >
            View all
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Studio</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.slice(0, 3).map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-4 font-medium">{booking.studio}</td>
                  <td className="px-3 py-4 text-muted-foreground">
                    {booking.customer}
                  </td>
                  <td className="px-3 py-4 text-muted-foreground">
                    {booking.date}
                  </td>
                  <td className="px-3 py-4 font-semibold">
                    {money(booking.amount)}
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No bookings available yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
