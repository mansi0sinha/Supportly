
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const initialForm = {
  name: "",
  email: "",
  username: "",
  bio: "",
  profilePicture: "",
  coverPicture: "",
};

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    if (status !== "authenticated") return;

    let cancelled = false;

    async function loadProfile() {
      try {
        setError("");

        const response = await fetch("/api/user/profile", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load profile.");
        }

        if (!cancelled) {
          setFormData({
            ...initialForm,
            ...data.profile,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load your profile.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [status, router]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save profile.");
      }

      setFormData((current) => ({
        ...current,
        ...data.profile,
      }));

      setMessage("Profile saved successfully!");
    } catch (err) {
      setError(err.message || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading your dashboard...
        </p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const fields = [
    {
      name: "name",
      label: "Creator Name",
      required: true,
      maxLength: 80,
    },
    {
      name: "username",
      label: "Username",
      required: true,
      maxLength: 25,
      placeholder: "your-username",
    },
    {
      name: "bio",
      label: "Creator Bio",
      type: "textarea",
      maxLength: 300,
      placeholder: "Tell supporters what you create...",
    },
    {
      name: "profilePicture",
      label: "Profile Picture URL",
      placeholder: "https://example.com/profile.jpg",
    },
    {
      name: "coverPicture",
      label: "Cover Picture URL",
      placeholder: "https://example.com/cover.jpg",
    },
  ];

  const publicPageUrl = formData.username.trim()
    ? `/${formData.username.trim().toLowerCase()}`
    : "";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold tracking-widest text-indigo-400">
          SUPPORTLY CREATOR
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your creator profile and public page.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8"
        >
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                {field.label}
                {field.required && (
                  <span className="ml-1 text-red-400">*</span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  maxLength={field.maxLength}
                  rows={4}
                  placeholder={field.placeholder}
                  className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              ) : (
                <input
                  id={field.name}
                  type="text"
                  name={field.name}
                  required={field.required}
                  maxLength={field.maxLength}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder || field.label}
                  autoComplete={
                    field.name === "username"
                      ? "username"
                      : field.name === "name"
                        ? "name"
                        : "off"
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              )}

              {field.name === "username" && (
                <p className="mt-1 text-xs text-slate-500">
                  Use 3–25 lowercase letters, numbers, underscores, or hyphens.
                </p>
              )}

              {field.name === "bio" && (
                <p className="mt-1 text-right text-xs text-slate-500">
                  {formData.bio.length}/300
                </p>
              )}
            </div>
          ))}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={formData.email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-400"
            />

            <p className="mt-1 text-xs text-slate-500">
              Your email is managed by your signed-in account.
            </p>
          </div>

          {message && (
            <p
              role="status"
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300"
            >
              {message}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="wrap-break-word rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <h2 className="font-semibold">
            Your public creator page
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Share this page with your supporters.
          </p>

          {publicPageUrl ? (
            <>
              <p className="mt-3 break-all rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 font-medium text-indigo-300">
                {publicPageUrl}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={publicPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  View Public Page ↗
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(
                        `${window.location.origin}${publicPageUrl}`
                      )
                      .then(() => {
                        setMessage("Public page link copied!");
                        setError("");
                      })
                      .catch(() => {
                        setError(
                          "Could not copy the link. Please copy it manually."
                        );
                        setMessage("");
                      });
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:text-white"
                >
                  Copy Link
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Save your profile before sharing any username changes.
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Add a username to create your public page link.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
