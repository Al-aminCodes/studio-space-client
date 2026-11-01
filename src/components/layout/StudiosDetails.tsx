"use client";
import { useSession } from "@/lib/auth-client";
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
};

type StudioDetailsProps = {
  studio: Studio;
};

export default function StudioDetails({ studio }: StudioDetailsProps) {
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [checkingBooking, setCheckingBooking] = useState(true);
  const { data: session, isPending: sessionLoading } = useSession();

  useEffect(() => {
    const checkBooking = async () => {
      const user = session?.user;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (sessionLoading) return;

      if (!user?.email || !studio?._id || !apiUrl) {
        setAlreadyBooked(false);
        setCheckingBooking(false);
        return;
      }

      try {
        setCheckingBooking(true);

        const response = await fetch(
          `${apiUrl}/my-bookings/${encodeURIComponent(user.email)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        const bookings = Array.isArray(data) ? data : (data.bookings ?? []);

        const exists = bookings.some(
          (booking: { studioId?: string; status?: string }) =>
            String(booking.studioId) === String(studio._id) &&
            ["Pending", "Confirmed"].includes(booking.status ?? ""),
        );

        setAlreadyBooked(exists);
      } catch (error) {
        console.error("Booking check error:", error);
      } finally {
        setCheckingBooking(false);
      }
    };

    checkBooking();
  }, [session?.user, sessionLoading, studio?._id]);
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
  } = studio;

  const formattedRate = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(hourlyRate);

  const formattedDeposit = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(securityDeposit);

  const router = useRouter();

  const [bookingLoading, setBookingLoading] = useState(false);

  const handleBooking = async () => {
    if (sessionLoading || bookingLoading) return;

    const user = session?.user;

    if (!user?.email) {
      toast.error("Please log in to book this studio.");
      router.push("/login");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      toast.error("Server URL is not configured.");
      return;
    }

    if (!studio?._id) {
      toast.error("Studio information is missing.");
      return;
    }

    setBookingLoading(true);

    try {
      const email = user.email.trim().toLowerCase();
      const studioId = String(studio._id);

      // Step 1: Check existing bookings
      const checkResponse = await fetch(
        `${apiUrl}/my-bookings/${encodeURIComponent(email)}`,
        { cache: "no-store" },
      );

      if (!checkResponse.ok) {
        throw new Error("Could not verify existing bookings.");
      }

      const existingData = await checkResponse.json();

      const existingBookings = Array.isArray(existingData)
        ? existingData
        : (existingData.bookings ?? []);

      const alreadyBooked = existingBookings.some(
        (booking: { studioId?: string; status?: string }) =>
          String(booking.studioId) === studioId &&
          ["Pending", "Confirmed"].includes(booking.status ?? ""),
      );

      if (alreadyBooked) {
        toast.info("You have already booked this studio.");
        return;
      }

      // Step 2: Create booking
      const bookingData = {
        studioId,
        studioTitle: studio.title,
        category: studio.category,
        hourlyRate: studio.hourlyRate,
        securityDeposit: studio.securityDeposit,
        maxCapacity: studio.maxCapacity,
        location: studio.location,
        imageUrl: studio.imageUrl ?? "",
        amenities: studio.amenities ?? [],
        overview: studio.overview,
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
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 409) {
        toast.info(result?.message || "You have already booked this studio.");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Booking failed.");
      }

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
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link
          href="/studios"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <FiArrowLeft size={16} />
          Back to Studios
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Section */}
          <section className="space-y-7 lg:col-span-7">
            {/* Studio Image */}
            <div className="relative h-[280px] overflow-hidden rounded-2xl border border-border bg-muted sm:h-[420px]">
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
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No studio image available
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <Badge className="border border-white/20 bg-white/95 text-gray-900 hover:bg-white/95">
                  {category}
                </Badge>
              </div>
            </div>

            {/* About Studio */}
            <div>
              <h2 className="mb-3 text-xl font-bold text-foreground">
                About this Space
              </h2>

              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground sm:text-base">
                {overview || "No overview information available."}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground">
                Amenities
              </h2>

              {amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <Badge
                      key={`${amenity}-${index}`}
                      variant="outline"
                      className="rounded-full border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground"
                    >
                      <FiCheckCircle className="mr-2 text-green-600 dark:text-green-400" />
                      {amenity}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No amenities information available.
                </p>
              )}
            </div>
          </section>

          {/* Right Section */}
          <aside className="space-y-5 lg:col-span-5">
            {/* Studio Information */}
            <Card className="border-border bg-card text-card-foreground shadow-sm transition-colors duration-300">
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div>
                  <Badge className="mb-3 border-0 bg-violet-100 text-violet-700 hover:bg-violet-100 dark:bg-violet-500/15 dark:text-violet-300 dark:hover:bg-violet-500/15">
                    {category}
                  </Badge>

                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {title}
                  </h1>
                </div>

                {/* Price */}
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {formattedRate}
                    <span className="ml-1 text-base font-normal text-muted-foreground">
                      / hr
                    </span>
                  </p>
                </div>

                <Separator />

                {/* Studio Features */}
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="mt-0.5 shrink-0" size={18} />
                    <span>{location}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiUsers className="shrink-0" size={18} />
                    <span>Max Capacity: {maxCapacity} People</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiShield className="shrink-0" size={18} />
                    <span>Security Deposit: {formattedDeposit}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiClock className="shrink-0" size={18} />
                    <span>Hourly Booking Available</span>
                  </div>
                </div>

                <Separator />

                {/* Booking Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleBooking}
                    disabled={
                      sessionLoading ||
                      checkingBooking ||
                      bookingLoading ||
                      alreadyBooked
                    }
                    className={`w-full transition-colors ${
                      alreadyBooked
                        ? "bg-green-600 hover:bg-green-600 text-white cursor-not-allowed"
                        : "h-12 flex-1 border-0 bg-indigo-600 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600"
                    }`}
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
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0 border-border"
                    aria-label="Add to favorites"
                  >
                    <FiHeart size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Host Information */}
            <Card className="border-border bg-card text-card-foreground shadow-sm transition-colors duration-300">
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 font-bold text-foreground">
                  Host Information
                </h2>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={userName}
                        className="rounded-full"
                      />
                    ) : (
                      "H"
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {userName || "Studio Host"}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Studio Owner
                    </p>

                    {userEmail && (
                      <a
                        href={`mailto:${userEmail}`}
                        className="mt-1 flex items-center gap-1 break-all text-xs text-primary hover:underline"
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
