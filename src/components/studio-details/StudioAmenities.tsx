import { FiCheckCircle } from "react-icons/fi";

type StudioAmenitiesProps = {
  amenities?: string[];
};

export default function StudioAmenities({
  amenities = [],
}: StudioAmenitiesProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">Amenities</h2>

      {amenities.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity, index) => (
            <span
              key={`${amenity}-${index}`}
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <FiCheckCircle className="mr-2 text-green-500" />
              {amenity}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          No amenities information available.
        </p>
      )}
    </section>
  );
}
