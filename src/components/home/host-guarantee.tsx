import Link from "next/link";
import {
  ShieldCheck,
  UserRoundCheck,
  Headset,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    title: "Liability Protection",
    description:
      "Clear booking information and a safer experience for studio users.",
    icon: ShieldCheck,
    color: "text-accent",
    iconBg: "bg-accent/10",
  },
  {
    title: "Verified Profiles",
    description:
      "Learn about the people and creative spaces behind each listing.",
    icon: UserRoundCheck,
    color: "text-secondary",
    iconBg: "bg-secondary/10",
  },
  {
    title: "Equipment Safety",
    description:
      "Review equipment details and studio facilities before booking.",
    icon: BadgeCheck,
    color: "text-purple-500 dark:text-purple-400",
    iconBg: "bg-purple-500/10",
  },
  {
    title: "Host Support",
    description:
      "Find help for your studio listing and booking-related questions.",
    icon: Headset,
    color: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
];

export default function HostGuarantee() {
  return (
    <section className="section-spacing">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-accent">
              Built for a safer creative community
            </p>

            <h2 className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
              Host Guarantee &
              <span className="block text-accent">Creator Support</span>
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-muted">
              We want creators and studio hosts to feel confident throughout
              their booking journey. Explore clear listings, useful studio
              information, and support when you need it.
            </p>

            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-xl
                border border-accent px-5 py-3 text-sm font-semibold
                text-accent transition hover:bg-accent hover:text-white"
            >
              Learn More
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-border bg-surface p-6
                    transition hover:border-accent/50 hover:shadow-lg
                    hover:shadow-black/5 dark:hover:shadow-black/20"
                >
                  <div
                    className={`mb-5 flex h-12 w-12 items-center
                      justify-center rounded-xl ${benefit.iconBg}`}
                  >
                    <Icon size={24} className={benefit.color} />
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
