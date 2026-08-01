import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginServerFn } from "@/server-auth";
import { PageHero } from "@/components/layout/PageShell";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In | 1 Million AI Superstars" },
      {
        name: "description",
        content: "Secure sign-in for 1 Million AI Superstars administrators.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Sign In | 1 Million AI Superstars" },
      { property: "og:description", content: "Secure sign-in for programme administrators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await loginServerFn({ data: { email, password } });
      navigate({ to: "/admin", replace: true });
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero eyebrow="Admin" title="Sign in" subtitle="Administrator access only." />
      <section className="pb-24">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] md:p-8"
          >
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                placeholder="you@example.com"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-[13px] font-medium">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                placeholder="••••••••"
              />
            </label>
            {error && (
              <p role="alert" className="mt-4 text-[13px] text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="gradient-bg mt-6 w-full rounded-full px-6 py-3 text-[15px] font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
