"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aperture, Eye, EyeOff, LoaderCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [password, setPassword] = useState("");

  const passwordRules = [
    { label: "At least 6 characters", valid: password.length >= 6 },
    { label: "One uppercase letter (A-Z)", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter (a-z)", valid: /[a-z]/.test(password) },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || googleLoading) return;

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const image = String(formData.get("image") || "").trim();

    const invalidRule = passwordRules.find((rule) => !rule.valid);
    if (invalidRule) {
      toast.error(
        "Password must have at least 6 characters, an uppercase letter, and a lowercase letter.",
      );
      return;
    }

    if (!name) {
      toast.error("Please enter your name.");
      return;
    }

    if (image) {
      try {
        const parsedUrl = new URL(image);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Invalid image URL");
        }
      } catch {
        toast.error(
          "Please enter a valid photo URL starting with http:// or https://.",
        );
        return;
      }
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
        callbackURL: "/login",
      });

      if (result.error) {
        toast.error(
          result.error.message || "Registration failed. Please try again.",
        );
        return;
      }

      toast.success("Registration successful! Please log in.");
      router.replace("/login?registered=1");
    } catch {
      toast.error(
        "Unable to register. Please check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    if (loading || googleLoading) return;

    setGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        newUserCallbackURL: "/",
        errorCallbackURL: "/register?error=google",
      });

      if (result.error) {
        toast.error(result.error.message || "Google sign-up failed.");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Unable to start Google sign-up. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-background px-4 py-12 text-foreground transition-colors sm:py-16">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface shadow-xl lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#16181E] p-10 text-white lg:flex xl:p-12">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-[#FF6B00]/20 blur-3xl" />
          <Link href="/" className="relative flex items-center gap-2.5">
            <Aperture className="size-9 text-[#FF6B00]" />
            <span className="text-2xl font-extrabold">
              Studio<span className="text-[#FF6B00]">Space</span>
            </span>
          </Link>
          <div className="relative py-10">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF6B00]">
              Get started
            </p>
            <h1 className="text-4xl font-extrabold leading-tight xl:text-5xl">
              Make room for your creativity.
            </h1>
            <p className="mt-5 max-w-md leading-7 text-gray-400">
              Join StudioSpace to discover inspiring studios and find a place
              where your next great idea can happen.
            </p>
          </div>
          <p className="relative text-sm text-gray-500">
            Find your space. Create your story.
          </p>
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 lg:hidden"
          >
            <Aperture className="size-8 text-accent" />
            <span className="text-xl font-extrabold">
              Studio<span className="text-accent">Space</span>
            </span>
          </Link>

          <div className="mb-7">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-muted">
              Join StudioSpace and explore creative spaces.
            </p>
          </div>

          <button
            type="button"
            disabled={loading || googleLoading}
            onClick={handleGoogleSignup}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition hover:bg-border disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.05 5.05 0 0 1-2.2 3.31v2.77h3.57c2.09-1.92 3.27-4.75 3.27-8.09Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.15A11 11 0 0 0 1 12c0 1.78.43 3.46 1.15 4.94l3.69-2.84Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.85 6.06l3.69 2.84C6.71 7.29 9.14 5.36 12 5.36Z"
                />
              </svg>
            )}
            Sign up with Google
          </button>

          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">OR REGISTER WITH EMAIL</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                minLength={2}
                required
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-semibold">
                Photo URL{" "}
                <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 pr-12 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>

              <ul className="space-y-1 pt-1 text-xs">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.label}
                    className={rule.valid ? "text-green-600" : "text-muted"}
                  >
                    <span aria-hidden="true">{rule.valid ? "✓" : "○"}</span>{" "}
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white transition hover:bg-[#E85F00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" /> Creating
                  account...
                </>
              ) : (
                <>
                  Register <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-accent hover:underline"
            >
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
