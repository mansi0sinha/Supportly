"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    profilePicture: "",
    coverPicture: "",
    razorpayId: "",
    razorpaySecret: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }

    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        username: "",
        profilePicture: "",
        coverPicture: "",
        razorpayId: "",
        razorpaySecret: "",
      });
    }
  }, [status, session, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Saved data:", formData);

    // Later:
    // Send this data to your database using an API route.
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-slate-400">
          Manage your Supportly profile and payment details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="yourusername"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Profile Picture URL
            </label>

            <input
              type="url"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              placeholder="https://example.com/profile.jpg"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Cover Picture */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Cover Picture URL
            </label>

            <input
              type="url"
              name="coverPicture"
              value={formData.coverPicture}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Razorpay ID */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Razorpay ID
            </label>

            <input
              type="text"
              name="razorpayId"
              value={formData.razorpayId}
              onChange={handleChange}
              placeholder="Your Razorpay Key ID"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Razorpay Secret */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Razorpay Secret
            </label>

            <input
              type="password"
              name="razorpaySecret"
              value={formData.razorpaySecret}
              onChange={handleChange}
              placeholder="Your Razorpay Secret"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>
<div className="flex justify-center">
  <button
    type="submit"
    className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-500"
  >
    Save
  </button>
</div>
        </form>
      </div>
    </main>
  );
};

export default Dashboard;

