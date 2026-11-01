import PageLoader from "@/components/layout/page-loader";

export default function MyListingsLoading() {
  return (
    <PageLoader
      title="Loading My Listings"
      description="Getting your studio listings ready."
      cards={3}
    />
  );
}
