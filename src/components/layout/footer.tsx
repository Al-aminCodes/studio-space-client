"use client";
import Link from "next/link";
import { Aperture, ArrowUpRight, Camera, Mail } from "lucide-react";
import { Linkedin, Youtube } from "lucide-brands";

const categories = [
  "Photo Studios",
  "Film Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

export default function Footer() {
  return (
    <footer
      id="about"
      className="border-t border-border bg-surface text-foreground"
    >
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Aperture className="size-8 text-[#FF6B00]" />
              <span className="font-heading text-xl font-extrabold text-white">
                Studio<span className="text-[#FF6B00]">Space</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-[#9CA3AF]">
              A creative home for creators. Discover inspiring spaces, connect
              with hosts, and bring your next big idea to life.
            </p>

            <div className="flex gap-3">
              {[
                {
                  label: "Instagram",
                  href: "https://instagram.com",
                  Icon: Camera,
                },
                {
                  label: "LinkedIn",
                  href: "https://linkedin.com",
                  Icon: Linkedin,
                },
                {
                  label: "YouTube",
                  href: "https://youtube.com",
                  Icon: Youtube,
                },
                {
                  label: "X",
                  href: "https://x.com",
                  Icon: ArrowUpRight,
                },
              ].map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-[#2A2D37] text-[#9CA3AF] transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                >
                  {label === "X" ? (
                    <span className="font-bold">𝕏</span>
                  ) : (
                    <Icon className="size-4" />
                  )}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-semibold text-white">Explore</h3>
            <div className="flex flex-col gap-3 text-sm text-[#9CA3AF]">
              <Link className="hover:text-[#FF6B00]" href="/">
                Home
              </Link>
              <Link className="hover:text-[#FF6B00]" href="/studios">
                Browse Studios
              </Link>
              <Link className="hover:text-[#FF6B00]" href="/#how-it-works">
                How It Works
              </Link>
              <Link className="hover:text-[#FF6B00]" href="/#about">
                About Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-semibold text-white">Studio Categories</h3>
            <div className="flex flex-col gap-3 text-sm text-[#9CA3AF]">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/studios?category=${encodeURIComponent(category)}`}
                  className="hover:text-[#FF6B00]"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-semibold text-white">Stay in the loop</h3>
            <p className="mb-4 text-sm leading-6 text-[#9CA3AF]">
              Get creative inspiration and studio updates in your inbox.
            </p>

            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                aria-label="Your email address"
                className="min-w-0 flex-1 rounded-lg border border-[#2A2D37] bg-[#16181E] px-3 py-3 text-sm text-white outline-none placeholder:text-[#6B7280] focus:border-[#FF6B00]"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                title="Newsletter integration coming soon"
                className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#FF6B00] text-white hover:bg-[#E85F00]"
              >
                <Mail className="size-4" />
              </button>
            </form>
            <p className="mt-2 text-xs text-[#6B7280]">
              Newsletter subscription will be connected later.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#2A2D37] pt-6 text-xs text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>Made for creators, by the creative community.</p>
        </div>
      </div>
    </footer>
  );
}
