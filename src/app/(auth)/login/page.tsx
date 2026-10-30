"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Aperture, Eye, EyeOff, LoaderCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function getRedirectPath() {
  const params = new URLSearchParams(window.location.search);
  const path = params.get("callbackURL") || params.get("redirect") || "/";
  return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || googleLoading) return;

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const callbackURL = getRedirectPath();

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL,
      });

      if (result.error) {
        toast.error(result.error.message || "Invalid email or password.");
        return;
      }

      toast.success("Login successful!");
      router.replace(callbackURL);
      router.refresh();
    } catch {
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (loading || googleLoading) return;

    setGoogleLoading(true);

    try {
      const callbackURL = getRedirectPath();

      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        errorCallbackURL: "/login?error=google",
      });

      if (result.error) {
        toast.error(result.error.message || "Google login failed.");
        setGoogleLoading(false);
      }
      // Better Auth normally redirects the browser to Google.
    } catch {
      toast.error("Unable to start Google login. Please try again.");
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
              Welcome back
            </p>
            <h1 className="text-4xl font-extrabold leading-tight xl:text-5xl">
              Your creative space is waiting.
            </h1>
            <p className="mt-5 max-w-md leading-7 text-gray-400">
              Discover inspiring studios and find the perfect space for your
              next creative project.
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

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight">Login</h2>
            <p className="mt-2 text-sm text-muted">
              Sign in to continue exploring creative spaces.
            </p>
          </div>

          <button
            type="button"
            disabled={loading || googleLoading}
            onClick={handleGoogleLogin}
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
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">OR CONTINUE WITH EMAIL</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "Password reset is not enabled for this assignment.",
                    )
                  }
                  className="text-xs font-semibold text-accent hover:underline sm:text-sm"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-12 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
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
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white transition hover:bg-[#E85F00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Login <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-accent hover:underline"
            >
              Register
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
