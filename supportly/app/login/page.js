
"use client";

import {
  FaGoogle,
  FaLinkedinIn,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaApple,
  FaGithub,
} from "react-icons/fa";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const socialButtons = [
  {
    name: "Google",
    icon: <FaGoogle className="text-[#4285F4]" />,
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedinIn className="text-[#0A66C2]" />,
  },
  {
    name: "Twitter",
    icon: <FaTwitter className="text-[#1DA1F2]" />,
  },
  {
    name: "Facebook",
    icon: <FaFacebookF className="text-[#1877F2]" />,
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="text-[#E4405F]" />,
  },
  {
    name: "Apple",
    icon: <FaApple className="text-white" />,
  },
  {
    name: "GitHub",
    icon: <FaGithub className="text-white" />,
  },
];

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  // Don't show login page while checking session
  if (status === "loading" || status === "authenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-400">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Supportly
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Login to connect with your fans and grow your support.
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {socialButtons.map((button) => (
            <button
              key={button.name}
              type="button"
              onClick={() => {
                if (button.name === "GitHub") {
                  signIn("github", {
                    callbackUrl: "/dashboard",
                  });
                }
              }}
              className="group flex w-full items-center rounded-lg border border-slate-800 bg-slate-900/70 px-5 py-3.5 text-sm font-medium text-slate-300 transition duration-200 hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white"
            >
              {/* Icon */}
              <span className="flex w-6 justify-center text-base">
                {button.icon}
              </span>

              {/* Text */}
              <span className="flex-1 pr-6 text-center">
                Continue with {button.name}
              </span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-800" />

          <span className="text-xs font-medium tracking-widest text-slate-600">
            SECURE LOGIN
          </span>

          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Terms */}
        <p className="text-center text-xs leading-5 text-slate-500">
          By continuing, you agree to Supportly&apos;s{" "}
          <span className="cursor-pointer text-slate-400 transition hover:text-white">
            Terms
          </span>{" "}
          and{" "}
          <span className="cursor-pointer text-slate-400 transition hover:text-white">
            Privacy Policy
          </span>
          .
        </p>

      </div>
    </main>
  );
}

