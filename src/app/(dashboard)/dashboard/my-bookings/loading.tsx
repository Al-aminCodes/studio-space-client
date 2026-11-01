import PageLoader from "@/components/layout/page-loader";

export default function MyBookingsLoading() {
  return (
    <PageLoader
      title="Loading My Bookings"
      description="Fetching your studio reservations."
      cards={3}
    />
  );
}
