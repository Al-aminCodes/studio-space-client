import StudioDetails from "@/components/layout/StudiosDetails";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StudioDetailsPage({ params }: Props) {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/studios/${id}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return <div className="p-10">Studio not found.</div>;
  }

  const studio = await response.json();
  console.log(studio);

  return <StudioDetails studio={studio} />;
}
