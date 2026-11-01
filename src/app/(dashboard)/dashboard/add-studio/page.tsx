"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  X,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  Users,
  Star,
} from "lucide-react";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
  "Dance Studio",
  "Meeting Room",
  "Creative Workspace",
  "Other",
];

const availableAmenities = [
  "Wi-Fi",
  "Air Conditioning",
  "Lighting Equipment",
  "Soundproofing",
  "Camera Equipment",
  "Microphones",
  "Green Screen",
  "Parking",
  "Restroom",
  "Kitchen",
  "Natural Lighting",
  "Furniture",
];

type StudioFormData = {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
  rating: number;
};

const initialForm: StudioFormData = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  imageUrl: "",
  amenities: [],
  overview: "",
  rating: 0,
};

const inputClass =
  "w-full rounded-xl border border-[#343743] bg-[#101116] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

const labelClass = "mb-2 block text-sm font-medium text-gray-300";

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [form, setForm] = useState<StudioFormData>(initialForm);
  const [saving, setSaving] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const userName = session?.user?.name ?? "";
  const userEmail = session?.user?.email ?? "";
  const userImage = session?.user?.image ?? "";

  const updateField = (field: keyof StudioFormData, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((previous) => ({
      ...previous,
      amenities: previous.amenities.includes(amenity)
        ? previous.amenities.filter((item) => item !== amenity)
        : [...previous.amenities, amenity],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session?.user) {
      toast.error("Please log in before adding a studio.");
      router.push("/login");
      return;
    }

    const hourlyRate = Number(form.hourlyRate);
    const securityDeposit = Number(form.securityDeposit);
    const maxCapacity = Number(form.maxCapacity);
    const { data, error } = await authClient.token();
    const token = data?.token;

    if (
      !form.title.trim() ||
      !form.category ||
      !form.location.trim() ||
      !form.overview.trim()
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (
      form.hourlyRate.trim() === "" ||
      form.securityDeposit.trim() === "" ||
      form.maxCapacity.trim() === "" ||
      !Number.isFinite(hourlyRate) ||
      !Number.isFinite(securityDeposit) ||
      !Number.isInteger(maxCapacity) ||
      hourlyRate <= 0 ||
      securityDeposit < 0 ||
      maxCapacity < 1
    ) {
      toast.error("Please enter valid prices and capacity.");
      return;
    }

    if (!Number.isFinite(form.rating) || form.rating < 1 || form.rating > 5) {
      toast.error("Please select a rating from 1 to 5 stars.");
      return;
    }

    if (
      form.imageUrl.trim() &&
      !/^https?:\/\/\S+$/i.test(form.imageUrl.trim())
    ) {
      toast.error("Please enter a valid image URL.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      toast.error("API URL is not configured.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${apiUrl}/add-studios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          hourlyRate,
          securityDeposit,
          maxCapacity,
          location: form.location.trim(),
          imageUrl: form.imageUrl.trim(),
          amenities: form.amenities,
          overview: form.overview.trim(),
          rating: Number(form.rating),
          userName,
          userEmail,
          userImage,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to create studio.");
      }

      toast.success("Studio added successfully!");
      setForm(initialForm);
      router.push("/dashboard/my-studios");
      router.refresh();
    } catch (error) {
      console.error("Create studio error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to save studio.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#0d0e12] text-white">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-orange-500" />
        Loading your account...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#0d0e12] px-4 text-white">
        <h2 className="text-2xl font-bold">Login Required</h2>
        <p className="text-sm text-gray-400">Log in to add a studio listing.</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e12] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
            StudioSpace / Listings
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">Add New Studio</h1>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Share your creative space with the StudioSpace community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Studio Information */}
          <section className="rounded-2xl border border-[#2a2d37] bg-[#16181e] p-5 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold">Studio Information</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className={labelClass}>
                  Studio Title *
                </label>
                <input
                  id="title"
                  className={inputClass}
                  placeholder="e.g. Downtown Photography Studio"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  maxLength={150}
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className={labelClass}>
                  Category *
                </label>
                <select
                  id="category"
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  <MapPin className="mr-1 inline h-4 w-4 text-orange-400" />
                  Location / Address *
                </label>
                <input
                  id="location"
                  className={inputClass}
                  placeholder="Street, city, country"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  maxLength={300}
                  required
                />
              </div>

              <div>
                <label htmlFor="hourlyRate" className={labelClass}>
                  <DollarSign className="mr-1 inline h-4 w-4 text-orange-400" />
                  Hourly Rate ($) *
                </label>
                <input
                  id="hourlyRate"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={inputClass}
                  placeholder="50.00"
                  value={form.hourlyRate}
                  onChange={(e) => updateField("hourlyRate", e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="securityDeposit" className={labelClass}>
                  Security Deposit ($) *
                </label>
                <input
                  id="securityDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  placeholder="100.00"
                  value={form.securityDeposit}
                  onChange={(e) =>
                    updateField("securityDeposit", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="maxCapacity" className={labelClass}>
                  <Users className="mr-1 inline h-4 w-4 text-orange-400" />
                  Maximum Capacity *
                </label>
                <input
                  id="maxCapacity"
                  type="number"
                  min="1"
                  step="1"
                  className={inputClass}
                  placeholder="10"
                  value={form.maxCapacity}
                  onChange={(e) => updateField("maxCapacity", e.target.value)}
                  required
                />
              </div>

              {/* Rating Field */}
              <div className="rounded-xl border border-[#343743] bg-[#101116] p-4">
                <label className={labelClass}>
                  <Star className="mr-1 inline h-4 w-4 text-amber-400" />
                  Studio Rating *
                </label>

                <div
                  className="flex items-center gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                  role="group"
                  aria-label="Select studio rating"
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hoverRating || form.rating);

                    return (
                      <button
                        key={star}
                        type="button"
                        aria-label={`Rate ${star} out of 5 stars`}
                        aria-pressed={form.rating === star}
                        onMouseEnter={() => setHoverRating(star)}
                        onFocus={() => setHoverRating(star)}
                        onBlur={() => setHoverRating(0)}
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            rating: star,
                          }))
                        }
                        className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                      >
                        <Star
                          size={30}
                          className={
                            active
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-500"
                          }
                        />
                      </button>
                    );
                  })}
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  {form.rating > 0
                    ? `${form.rating}.0 out of 5 stars`
                    : "Select a rating from 1 to 5"}
                </p>
              </div>

              <div>
                <label htmlFor="imageUrl" className={labelClass}>
                  <ImageIcon className="mr-1 inline h-4 w-4 text-orange-400" />
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  className={inputClass}
                  placeholder="https://example.com/studio.jpg"
                  value={form.imageUrl}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                />
              </div>

              {form.imageUrl.trim() &&
                /^https?:\/\/\S+$/i.test(form.imageUrl.trim()) && (
                  <div className="sm:col-span-2">
                    <p className="mb-2 text-xs text-gray-400">Image preview</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.imageUrl}
                      alt="Studio preview"
                      className="h-48 w-full rounded-xl border border-[#343743] object-cover"
                    />
                  </div>
                )}
            </div>
          </section>

          {/* Amenities */}
          <section className="rounded-2xl border border-[#2a2d37] bg-[#16181e] p-5 sm:p-8">
            <h2 className="mb-2 text-lg font-semibold">Amenities</h2>
            <p className="mb-5 text-sm text-gray-400">
              Select the amenities available in your studio.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {availableAmenities.map((amenity) => {
                const checked = form.amenities.includes(amenity);

                return (
                  <label
                    key={amenity}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                      checked
                        ? "border-orange-500 bg-orange-500/10 text-orange-300"
                        : "border-[#343743] bg-[#101116] text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity)}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>

            {form.amenities.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {form.amenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1.5 text-xs text-orange-300"
                  >
                    {amenity}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Overview */}
          <section className="rounded-2xl border border-[#2a2d37] bg-[#16181e] p-5 sm:p-8">
            <h2 className="mb-5 text-lg font-semibold">Detailed Overview</h2>
            <label htmlFor="overview" className={labelClass}>
              Describe your studio *
            </label>
            <textarea
              id="overview"
              rows={6}
              className={`${inputClass} resize-y`}
              placeholder="Describe the space, equipment, ideal uses, access instructions, and anything guests should know..."
              value={form.overview}
              onChange={(e) => updateField("overview", e.target.value)}
              maxLength={5000}
              required
            />
            <p className="mt-2 text-right text-xs text-gray-500">
              {form.overview.length}/5000
            </p>
          </section>

          {/* Listing Owner */}
          <section className="rounded-2xl border border-[#2a2d37] bg-[#16181e] p-5 sm:p-8">
            <h2 className="mb-5 text-lg font-semibold">Listing Owner</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ownerName" className={labelClass}>
                  User Name
                </label>
                <input
                  id="ownerName"
                  value={userName}
                  readOnly
                  className={`${inputClass} cursor-not-allowed text-gray-400`}
                />
              </div>

              <div>
                <label htmlFor="ownerEmail" className={labelClass}>
                  User Email
                </label>
                <input
                  id="ownerEmail"
                  type="email"
                  value={userEmail}
                  readOnly
                  className={`${inputClass} cursor-not-allowed text-gray-400`}
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Owner information comes from your logged-in account.
            </p>
          </section>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/dashboard/my-studios")}
              className="rounded-xl border border-[#343743] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:bg-[#222630]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {saving ? "Saving Studio..." : "Create Studio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
