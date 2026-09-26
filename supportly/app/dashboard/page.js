
"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // User is not logged in
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // While checking login status
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  // Don't show dashboard to logged-out users
  if (status === "unauthenticated") {
    return null;
  }

  // Logged in
  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 text-slate-400">
        Welcome, {session?.user?.name || session?.user?.email}
      </p>
    </div>
  );
};

export default Dashboard;

