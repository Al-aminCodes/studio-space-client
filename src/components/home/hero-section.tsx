import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const highlights = [
  "Creative spaces",
  "Flexible hourly booking",
  "Made for creators",
];

export default function HeroSection() {
  return (
    <section className="px-0 pt-5 sm:pt-8">
      <div className="container-page">
        <div
          className="relative flex min-h-[500px] items-center overflow-hidden
            rounded-3xl border border-border bg-surface bg-cover bg-center
            sm:min-h-[560px]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=85')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="relative z-10 max-w-3xl px-6 py-16 sm:px-10 lg:px-14">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full
              border border-[#FF6B00]/50 bg-black/30 px-4 py-2
              text-xs font-bold uppercase tracking-[0.18em] text-orange-400"
            >
              <Sparkles size={15} />
              Your space. Your vision.
            </div>

            <h1
              className="text-4xl font-extrabold leading-tight tracking-tight
              text-white sm:text-5xl lg:text-7xl"
            >
              Make room for
              <span className="block text-[#FF6B00]">your next big idea.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
              Discover inspiring photography studios, cinematic stages, podcast
              rooms, and creative workspaces built for people who make things
              happen.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/studios"
                className="inline-flex items-center gap-2 rounded-xl
                  bg-[#FF6B00] px-6 py-3.5 text-sm font-bold text-white
                  transition hover:bg-orange-600"
              >
                Explore Studios
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/add-studio"
                className="inline-flex items-center gap-2 rounded-xl
                  border border-white/60 bg-black/20 px-6 py-3.5
                  text-sm font-semibold text-white transition
                  hover:border-[#FF6B00] hover:bg-[#FF6B00]/20"
              >
                Host Your Space
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-200"
                >
                  <CheckCircle2 size={17} className="text-[#FF6B00]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <a
            href="#how-it-works"
            aria-label="Scroll to How It Works"
            className="absolute bottom-7 right-7 z-10 hidden items-center
              gap-2 text-xs uppercase tracking-widest text-white/80
              transition hover:text-[#FF6B00] lg:flex"
          >
            Explore
            <ArrowDown size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
