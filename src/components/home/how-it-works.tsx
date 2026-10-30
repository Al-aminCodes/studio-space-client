import Link from "next/link";
import {
  Search,
  CalendarDays,
  CreditCard,
  Rocket,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Explore unique studios that match your vision, style, and budget.",
    icon: Search,
    color: "text-accent",
    iconBg: "bg-accent/10",
  },
  {
    number: "02",
    title: "Choose Your Hours",
    description:
      "Select your preferred date and time for your creative session.",
    icon: CalendarDays,
    color: "text-secondary",
    iconBg: "bg-secondary/10",
  },
  {
    number: "03",
    title: "Book Your Studio",
    description:
      "Review the details and submit your booking request with confidence.",
    icon: CreditCard,
    color: "text-purple-500 dark:text-purple-400",
    iconBg: "bg-purple-500/10",
  },
  {
    number: "04",
    title: "Create & Produce",
    description: "Show up, get inspired, and bring your ideas to life.",
    icon: Rocket,
    color: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-spacing scroll-mt-24">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.7fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-accent">
              Simple by design
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>

            <p className="mt-4 max-w-md leading-7 text-muted">
              From finding the perfect space to creating your next masterpiece,
              getting started is simple.
            </p>

            <Link
              href="/studios"
              className="mt-7 inline-flex items-center gap-2 rounded-xl
                border border-accent px-5 py-3 text-sm font-semibold
                text-accent transition hover:bg-accent hover:text-white"
            >
              Explore Studios
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="rounded-2xl border border-border bg-surface p-5
                    transition hover:-translate-y-1 hover:border-accent/50"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center
                      rounded-2xl ${step.iconBg}`}
                  >
                    <Icon size={26} className={step.color} />
                  </div>

                  <p className={`text-sm font-bold ${step.color}`}>
                    {step.number}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {step.description}
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
