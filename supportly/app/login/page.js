
"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setSuccess("");
  }

  async function handleOAuth(provider) {
    setError("");
    setBusy(true);

    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch {
      setError("Unable to start sign-in. Please try again.");
      setBusy(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to create your account.");
          return;
        }

        setMode("login");
        setPassword("");
        setSuccess("Account created! Sign in with your email and password.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      if (result?.ok) {
        router.replace("/dashboard");
        router.refresh();
      } else {
        setError("Sign-in failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading" || status === "authenticated") {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-400">Checking your session...</p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-slate-950 px-5 py-16 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-xl font-bold shadow-lg shadow-indigo-950/50">
            S
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {mode === "login"
              ? "Sign in to continue your creator journey."
              : "Join Supportly and start building your creator page."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 sm:p-7">
          <div className="space-y-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleOAuth("google")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm font-medium transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaGoogle className="text-base text-[#4285F4]" />
              Continue with Google
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => handleOAuth("github")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm font-medium transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaGithub className="text-base" />
              Continue with GitHub
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-[11px] font-medium tracking-widest text-slate-500">
              OR WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300"
            >
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={80}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="mb-2 block text-sm text-slate-300">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    required
                    minLength={3}
                    maxLength={25}
                    pattern="[a-zA-Z0-9_-]+"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Letters, numbers, underscores and hyphens only.
                  </p>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={mode === "register" ? 8 : undefined}
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "At least 8 characters" : "Enter your password"}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center rounded-xl bg-indigo-500 px-4 py-3.5 text-sm font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {mode === "login" ? "New to Supportly?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => changeMode(mode === "login" ? "register" : "login")}
              className="font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          By continuing, you agree to Supportly&apos;s terms and privacy policy.
        </p>
      </div>
    </main>
  );
}
