"use client";

import {
  FiClock,
  FiHeart,
  FiMapPin,
  FiShield,
  FiStar,
  FiUsers,
} from "react-icons/fi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type StudioBookingCardProps = {
  category: string;
  title: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  rating?: number;

  sessionLoading: boolean;
  checkingBooking: boolean;
  bookingLoading: boolean;
  alreadyBooked: boolean;

  onBooking: () => void;
  onFavorite: () => void;
};

export default function StudioBookingCard({
  category,
  title,
  hourlyRate,
  securityDeposit,
  maxCapacity,
  location,
  rating,
  sessionLoading,
  checkingBooking,
  bookingLoading,
  alreadyBooked,
  onBooking,
  onFavorite,
}: StudioBookingCardProps) {
  const formattedRate = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(hourlyRate) || 0);

  const formattedDeposit = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(securityDeposit) || 0);

  const currentRating = Math.min(5, Math.max(0, Number(rating) || 0));

  return (
    <Card
      className="shadow-sm transition-colors duration-300"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--foreground)",
      }}
    >
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div>
          <Badge
            className="mb-3 border-0 text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {category}
          </Badge>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={17}
                  className={
                    star <= Math.round(currentRating)
                      ? "fill-amber-400 text-amber-400"
                      : ""
                  }
                  style={
                    star > Math.round(currentRating)
                      ? { color: "var(--muted)" }
                      : undefined
                  }
                />
              ))}
            </div>

            <span className="text-sm font-semibold">
              {currentRating > 0 ? currentRating.toFixed(1) : "No rating"}
            </span>

            <span className="text-sm" style={{ color: "var(--muted)" }}>
              / 5
            </span>
          </div>
        </div>

        <div>
          <p className="text-3xl font-bold tracking-tight">
            {formattedRate}
            <span
              className="ml-1 text-base font-normal"
              style={{ color: "var(--muted)" }}
            >
              / hr
            </span>
          </p>
        </div>

        <div className="space-y-4 text-sm" style={{ color: "var(--muted)" }}>
          <div className="flex items-start gap-3">
            <FiMapPin
              className="mt-0.5 shrink-0"
              size={18}
              style={{ color: "var(--accent)" }}
            />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-3">
            <FiUsers
              size={18}
              className="shrink-0"
              style={{ color: "var(--accent)" }}
            />
            <span>Max Capacity: {maxCapacity} People</span>
          </div>

          <div className="flex items-center gap-3">
            <FiShield
              size={18}
              className="shrink-0"
              style={{ color: "var(--accent)" }}
            />
            <span>Security Deposit: {formattedDeposit}</span>
          </div>

          <div className="flex items-center gap-3">
            <FiClock
              size={18}
              className="shrink-0"
              style={{ color: "var(--accent)" }}
            />
            <span>Hourly Booking Available</span>
          </div>
        </div>

        <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

        <div className="flex gap-3">
          <Button
            onClick={onBooking}
            disabled={
              sessionLoading ||
              checkingBooking ||
              bookingLoading ||
              alreadyBooked
            }
            className="h-12 flex-1 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: alreadyBooked ? "#16a34a" : "var(--accent)",
            }}
          >
            {sessionLoading || checkingBooking
              ? "Checking Booking..."
              : bookingLoading
                ? "Booking..."
                : alreadyBooked
                  ? "Already Booked ✓"
                  : "Book This Studio"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0"
            aria-label="Add to favorites"
            onClick={onFavorite}
          >
            <FiHeart size={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
