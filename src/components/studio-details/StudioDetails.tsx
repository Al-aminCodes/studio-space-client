"use client";

import { authClient, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";

import StudioGallery from "./studioGallery";
import StudioOverview from "./StudioOverview";
import StudioAmenities from "./StudioAmenities";
import StudioBookingCard from "./StudioBookingCard";
import StudioHostInfo from "./StudioHostInfo";

import type { Studio, Booking } from "./types";

type StudioDetailsProps = {
  studio: Studio;
};

export default function StudioDetails({ studio }: StudioDetailsProps) {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = useSession();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Booking states
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [checkingBooking, setCheckingBooking] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Studio owner verification
  const isStudioOwner =
    !!session?.user?.email &&
    !!studio.userEmail &&
    session.user.email.trim().toLowerCase() ===
      studio.userEmail.trim().toLowerCase();

  // Save gallery images to MongoDB
  const saveGalleryImages = async (nextImages: string[]): Promise<boolean> => {
    try {
      if (!apiUrl) {
        throw new Error("API URL is missing.");
      }

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${apiUrl}/studios/${encodeURIComponent(studio._id)}/images`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            images: nextImages,
          }),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || `HTTP Error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Gallery save error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update gallery images.",
      );

      return false;
    }
  };

  // Check existing booking
  useEffect(() => {
    if (sessionLoading) return;

    let cancelled = false;

    async function checkBooking() {
      const email = session?.user?.email;

      if (!email || !studio._id || !apiUrl) {
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

        if (!cancelled) {
          setAlreadyBooked(exists);
        }
      } catch (error) {
        console.error("Booking check error:", error);
      } finally {
        if (!cancelled) {
          setCheckingBooking(false);
        }
      }
    }

    void checkBooking();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email, sessionLoading, studio._id, apiUrl]);

  // Create booking - original functionality preserved
  const handleBooking = async () => {
    if (sessionLoading || bookingLoading || alreadyBooked) return;

    const user = session?.user;

    if (!user?.email) {
      toast.error("Please log in to book this studio.");
      router.push("/login");
      return;
    }

    if (!apiUrl || !studio._id) {
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
          ← Back to Studios
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left section */}
          <section className="space-y-7 lg:col-span-7">
            <StudioGallery
              studio={studio}
              isStudioOwner={isStudioOwner}
              onSaveImages={saveGalleryImages}
            />

            <StudioOverview overview={studio.overview} />

            <Separator style={{ backgroundColor: "var(--border)" }} />

            <StudioAmenities amenities={studio.amenities} />
          </section>

          {/* Right section */}
          <aside className="space-y-5 lg:col-span-5">
            <StudioBookingCard
              category={studio.category}
              title={studio.title}
              hourlyRate={studio.hourlyRate}
              securityDeposit={studio.securityDeposit}
              maxCapacity={studio.maxCapacity}
              location={studio.location}
              rating={studio.rating}
              sessionLoading={sessionLoading}
              checkingBooking={checkingBooking}
              bookingLoading={bookingLoading}
              alreadyBooked={alreadyBooked}
              onBooking={handleBooking}
              onFavorite={() => toast.info("Favorites feature is coming soon.")}
            />

            <StudioHostInfo
              userName={studio.userName}
              userEmail={studio.userEmail}
              userImage={studio.userImage}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
