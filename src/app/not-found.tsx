import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[#080e16] px-4 py-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=90')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#050a12]/75" />
      <div className="absolute inset-0 bg-linear-to-b from-[#050a12]/30 via-transparent to-[#050a12]/80" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-orange-500">
          StudioSpace
        </p>

        <h1 className="text-8xl font-extrabold tracking-tight text-white sm:text-9xl">
          404
        </h1>

        <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-300 sm:text-base">
          The studio you are looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-600/40"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}
