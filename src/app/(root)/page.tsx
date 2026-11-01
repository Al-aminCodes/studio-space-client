import { connection } from "next/server";
import HeroSection from "@/components/home/hero-section";
// import CategorySection from "@/components/home/category-section";
// import FeaturedStudios from "@/components/home/featured-studios";
import HowItWorks from "@/components/home/how-it-works";
import HostGuarantee from "@/components/home/host-guarantee";
import HomeCTA from "@/components/home/home-cta";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import BrowseCategories from "@/components/home/BrowseCategories";

export default async function HomePage() {
  await connection();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      {/* <CategorySection />
      <FeaturedStudios /> */}
      <FeaturedStudios />

      <BrowseCategories />
      <HowItWorks />
      <HostGuarantee />
      <HomeCTA />
    </main>
  );
}
