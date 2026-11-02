"use client";

import { authClient, useSession } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiMail,
  FiMapPin,
  FiShield,
  FiUsers,
  FiStar,
} from "react-icons/fi";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl?: string;
  amenities?: string[];
  overview: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  rating?: number;
};

type Booking = {
  studioId?: string;
  status?: string;
};

type StudioDetailsProps = {
  studio: Studio;
};

export default function StudioDetails({ studio }: StudioDetailsProps) {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [checkingBooking, setCheckingBooking] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const {
    _id,
    title,
    category,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location,
    imageUrl,
    amenities = [],
    overview,
    userName,
    userEmail,
    userImage,
    rating,
  } = studio;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

  // Check existing booking
  useEffect(() => {
    if (sessionLoading) return;

    let cancelled = false;

    async function checkBooking() {
      const email = session?.user?.email;

      if (!email || !studio?._id || !apiUrl) {
        setAlreadyBooked(false);
        setCheckingBooking(false);
        return;
      }

      setCheckingBooking(true);

      try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          throw new Error("Unable to verify your session.");
        }

        const response = await fetch(
          `${apiUrl}/my-bookings/${encodeURIComponent(
            email.trim().toLowerCase(),
          )}`,
          {
            cache: "no-store",
            headers: {
              authorization: `Bearer ${data.token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings.");
        }

        const result = await response.json();

        const bookings: Booking[] = Array.isArray(result)
          ? result
          : (result.bookings ?? []);

        const exists = bookings.some(
          (booking) =>
            String(booking.studioId) === String(studio._id) &&
            ["Pending", "Confirmed"].includes(booking.status ?? ""),
        );

        if (!cancelled) setAlreadyBooked(exists);
      } catch (error) {
        console.error("Booking check error:", error);
      } finally {
        if (!cancelled) setCheckingBooking(false);
      }
    }

    void checkBooking();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email, sessionLoading, studio?._id, apiUrl]);

  // Create booking
  const handleBooking = async () => {
    if (sessionLoading || bookingLoading || alreadyBooked) return;

    const user = session?.user;

    if (!user?.email) {
      toast.error("Please log in to book this studio.");
      router.push("/login");
      return;
    }

    if (!apiUrl || !studio?._id) {
      toast.error("Studio or server information is missing.");
      return;
    }

    setBookingLoading(true);

    try {
      const email = user.email.trim().toLowerCase();
      const studioId = String(studio._id);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        toast.error("Please log in again.");
        router.push("/login");
        return;
      }

      const checkResponse = await fetch(
        `${apiUrl}/my-bookings/${encodeURIComponent(email)}`,
        {
          cache: "no-store",
          headers: {
            authorization: `Bearer ${data.token}`,
          },
        },
      );

      if (!checkResponse.ok) {
        throw new Error("Could not verify existing bookings.");
      }

      const existingData = await checkResponse.json();

      const bookings: Booking[] = Array.isArray(existingData)
        ? existingData
        : (existingData.bookings ?? []);

      const exists = bookings.some(
        (booking) =>
          String(booking.studioId) === studioId &&
          ["Pending", "Confirmed"].includes(booking.status ?? ""),
      );

      if (exists) {
        setAlreadyBooked(true);
        toast.info("You have already booked this studio.");
        return;
      }

      const bookingData = {
        studioId,
        studioTitle: title,
        category,
        hourlyRate,
        securityDeposit,
        maxCapacity,
        location,
        imageUrl: imageUrl ?? "",
        amenities,
        overview,
        userName: user.name ?? "",
        userEmail: email,
        userImage: user.image ?? "",
        status: "Pending",
        bookingDate: new Date().toISOString(),
      };

      const response = await fetch(`${apiUrl}/bookings-studios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 409) {
        setAlreadyBooked(true);
        toast.info(result?.message || "You have already booked this studio.");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Booking failed.");
      }

      setAlreadyBooked(true);
      toast.success("Studio booked successfully!");
      router.push("/dashboard/my-bookings");
      router.refresh();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/studios"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-75"
          style={{ color: "var(--muted)" }}
        >
          <FiArrowLeft size={16} />
          Back to Studios
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left section */}
          <section className="space-y-7 lg:col-span-7">
            <div
              className="relative h-[280px] overflow-hidden rounded-2xl border sm:h-[420px]"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className="flex h-full items-center justify-center"
                  style={{ color: "var(--muted)" }}
                >
                  No studio image available
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                <Badge className="border border-white/20 bg-white text-gray-900">
                  {category}
                </Badge>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-bold">About this Space</h2>

              <p
                className="whitespace-pre-wrap text-sm leading-7 sm:text-base"
                style={{ color: "var(--muted)" }}
              >
                {overview || "No overview information available."}
              </p>
            </div>

            <Separator style={{ backgroundColor: "var(--border)" }} />

            <div>
              <h2 className="mb-4 text-xl font-bold">Amenities</h2>

              {amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <Badge
                      key={`${amenity}-${index}`}
                      variant="outline"
                      className="rounded-full px-4 py-2 text-sm font-medium"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                    >
                      <FiCheckCircle className="mr-2 text-green-500" />
                      {amenity}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  No amenities information available.
                </p>
              )}
            </div>
          </section>

          {/* Right section */}
          <aside className="space-y-5 lg:col-span-5">
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
                      {currentRating > 0
                        ? currentRating.toFixed(1)
                        : "No rating"}
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

                <Separator style={{ backgroundColor: "var(--border)" }} />

                <div
                  className="space-y-4 text-sm"
                  style={{ color: "var(--muted)" }}
                >
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
                      className="shrink-0"
                      size={18}
                      style={{ color: "var(--accent)" }}
                    />
                    <span>Max Capacity: {maxCapacity} People</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiShield
                      className="shrink-0"
                      size={18}
                      style={{ color: "var(--accent)" }}
                    />
                    <span>Security Deposit: {formattedDeposit}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiClock
                      className="shrink-0"
                      size={18}
                      style={{ color: "var(--accent)" }}
                    />
                    <span>Hourly Booking Available</span>
                  </div>
                </div>

                <Separator style={{ backgroundColor: "var(--border)" }} />

                <div className="flex gap-3">
                  <Button
                    onClick={handleBooking}
                    disabled={
                      sessionLoading ||
                      checkingBooking ||
                      bookingLoading ||
                      alreadyBooked
                    }
                    className="h-12 flex-1 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{
                      backgroundColor: alreadyBooked
                        ? "#16a34a"
                        : "var(--accent)",
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
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    aria-label="Add to favorites"
                    onClick={() =>
                      toast.info("Favorites feature is coming soon.")
                    }
                  >
                    <FiHeart size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Host information */}
            <Card
              className="shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 font-bold">Host Information</h2>

                <div className="flex items-center gap-4">
                  <div
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border text-lg font-bold"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--accent)",
                    }}
                  >
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt={userName || "Studio host"}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      userName?.trim().charAt(0).toUpperCase() || "H"
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold">
                      {userName || "Studio Host"}
                    </h3>

                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      Studio Owner
                    </p>

                    {userEmail && (
                      <a
                        href={`mailto:${userEmail}`}
                        className="mt-1 flex items-center gap-1 break-all text-xs hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        <FiMail size={13} className="shrink-0" />
                        {userEmail}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
