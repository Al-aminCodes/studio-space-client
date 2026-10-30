import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="section-spacing">
      <div className="container-page">
        <div
          className="relative overflow-hidden rounded-3xl border border-border
            bg-surface bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=85')",
          }}
        >
          <div className="absolute inset-0 bg-white/85 dark:bg-[#0D0E12]/90" />

          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />

          <div className="relative flex flex-col gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-16">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-accent">
                <Sparkles size={16} />
                Join the creative movement
              </div>

              <h2 className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Your next project
                <span className="block">starts here.</span>
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-muted">
                Find your space, meet your vision, and create something worth
                sharing.
              </p>
            </div>

            <Link
              href="/studios"
              className="inline-flex shrink-0 items-center justify-center
                gap-3 rounded-xl bg-accent px-7 py-4 text-sm font-bold
                text-white transition hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Explore Studios
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
