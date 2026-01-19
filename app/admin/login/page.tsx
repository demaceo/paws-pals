"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { buttonStyles, cardStyles, inputStyles } from "@/lib/styles";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/10" />
        <div className="absolute bottom-[-10%] right-0 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl dark:bg-orange-800/15" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className={`${cardStyles.gradient} w-full max-w-md space-y-6 p-8`}>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-3 py-2 shadow-sm ring-1 ring-orange-100/70 dark:bg-orange-950/30 dark:ring-orange-900/40">
              <span className="text-xl">🐾</span>
              <div className="leading-tight">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500 dark:text-orange-300">
                  Admin
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Shelter Console
                </p>
              </div>
            </div>
            <span className="rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm dark:bg-white dark:text-gray-900">
              Secure
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Login
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Access the dog management dashboard
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyles.base}
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyles.base}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-800 shadow-sm dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${buttonStyles.primary} w-full justify-center text-center disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Use your admin credentials to manage dogs and inquiries.
          </p>
        </div>
      </div>
    </div>
  );
}
