"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StudioListings from "@/components/dashboard/studio-listings";
import type { Studio } from "@/components/dashboard/types";

export default function MyStudiosPage() {
  const router = useRouter();
  const [studios, setStudios] = useState<Studio[]>([]);

  const handleAdd = () => {
    router.push("/dashboard/add-studio");
  };

  const handleEdit = (studio: Studio) => {
    console.log("Edit studio:", studio);
    // পরে edit route বা edit dialog যুক্ত করবে
  };

  const handleDelete = (studioId: string) => {
    setStudios((previousStudios) =>
      previousStudios.filter((studio) => String(studio.id) !== studioId),
    );
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">My Studio Listings</h1>

      <StudioListings
        studios={studios}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
