import StudioDetails from "@/components/studio-details/StudioDetails";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StudioDetailsPage({ params }: Props) {
  const { id } = await params;
  const jwkToken = await auth.api.getToken({
    headers: await headers(),
  });
  const token = jwkToken?.token;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/studios/${id}`,
    {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return <div className="p-10">Studio not found.</div>;
  }

  const studio = await response.json();

  return <StudioDetails studio={studio} />;
}
