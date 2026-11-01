import PageLoader from "@/components/layout/page-loader";

export default function HomeLoading() {
  return (
    <PageLoader
      title="Loading Home"
      description="Discover creative spaces for your next project."
      cards={3}
    />
  );
}
