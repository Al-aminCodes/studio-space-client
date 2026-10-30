import HeroSection from "@/components/home/hero-section";
// import CategorySection from "@/components/home/category-section";
// import FeaturedStudios from "@/components/home/featured-studios";
import HowItWorks from "@/components/home/how-it-works";
import HostGuarantee from "@/components/home/host-guarantee";
import HomeCTA from "@/components/home/home-cta";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      {/* <CategorySection />
      <FeaturedStudios /> */}
      <HowItWorks />
      <HostGuarantee />
      <HomeCTA />
    </main>
  );
}
