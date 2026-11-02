import Image from "next/image";
import { FiMail } from "react-icons/fi";

type StudioHostInfoProps = {
  userName?: string;
  userEmail?: string;
  userImage?: string;
};

export default function StudioHostInfo({
  userName,
  userEmail,
  userImage,
}: StudioHostInfoProps) {
  return (
    <section
      className="rounded-xl border p-5 shadow-sm sm:p-6"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--foreground)",
      }}
    >
      <h2 className="mb-5 font-bold">Host Information</h2>

      <div className="flex items-center gap-4">
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border text-lg font-bold"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--accent)",
          }}
        >
          {userImage ? (
            <Image
              src={userImage}
              alt={userName || "Studio host"}
              fill
              unoptimized
              sizes="48px"
              className="object-cover"
            />
          ) : (
            userName?.trim().charAt(0).toUpperCase() || "H"
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold">{userName || "Studio Host"}</h3>

          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Studio Owner
          </p>

          {userEmail && (
            <a
              href={`mailto:${userEmail}`}
              className="mt-1 flex items-center gap-1 break-all text-xs hover:underline"
              style={{ color: "var(--accent)" }}
            >
              <FiMail size={13} className="shrink-0" />
              {userEmail}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
