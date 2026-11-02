import type { Studio } from "./types";

type StudioOverviewProps = {
  overview: Studio["overview"];
};

export default function StudioOverview({ overview }: StudioOverviewProps) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold">About this Space</h2>

      <p
        className="whitespace-pre-wrap text-sm leading-7 sm:text-base"
        style={{ color: "var(--muted)" }}
      >
        {overview || "No overview information available."}
      </p>
    </section>
  );
}
