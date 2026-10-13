
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        {status === "loading"
          ? "Loading settings..."
          : "Redirecting to login..."}
      </main>
    );
  }

  const user = session.user;

  const sections = [
    {
      title: "Creator Profile",
      description:
        "Update the details your supporters see on your public page.",
      link: "/dashboard",
      linkText: "Manage profile",
    },
    {
      title: "Account Security",
      description:
        "Password changes are not available yet. Keep your login credentials secure.",
      link: null,
      linkText: null,
    },
    {
      title: "Payment Settings",
      description:
        "Configure creator payments after the server-side Razorpay integration is verified.",
      link: null,
      linkText: null,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold tracking-widest text-indigo-400">
          SUPPORTLY
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your account and creator preferences.
        </p>

        {/* Account summary */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold">
              {(user?.name || user?.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">
                {user?.name || "Supportly Creator"}
              </h2>

              <p className="mt-1 truncate text-sm text-slate-400">
                {user?.email}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                @{user?.username || "username-not-set"}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-800 pt-5">
            <p className="text-xs text-slate-500">
              Signed-in account
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Your account details are displayed here. Edit your
              creator profile from the dashboard.
            </p>
          </div>
        </section>

        {/* Settings options */}
        <div className="mt-6 space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="text-lg font-semibold">
                {section.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {section.description}
              </p>

              {section.link ? (
                <Link
                  href={section.link}
                  className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium transition hover:bg-indigo-500"
                >
                  {section.linkText}
                </Link>
              ) : (
                <span className="mt-4 inline-block rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                  Not available yet
                </span>
              )}
            </section>
          ))}
        </div>

        {/* Account actions */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">
            Account Actions
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Sign out of your current Supportly session.
          </p>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
          >
            Sign Out
          </button>
        </section>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Supportly
          </Link>
        </div>
      </div>
    </main>
  );
}
