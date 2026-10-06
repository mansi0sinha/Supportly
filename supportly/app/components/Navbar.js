
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user's name
  const userName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "User";

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-indigo-500 text-sm font-bold">
            S
          </div>

          <span className="text-lg font-semibold tracking-tight">
            Supportly
          </span>
        </div>

        {/* Navigation */}
        <ul className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <li>
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
          </li>

          <li>
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
          </li>

          <li>
            <Link href="/creators" className="transition hover:text-white">
              Creators
            </Link>
          </li>
        </ul>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <span className="text-sm text-slate-500">
              Loading...
            </span>
          ) : session ? (
            /* Logged in */
            <div className="relative" ref={dropdownRef}>

              {/* Profile Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 border border-slate-800 bg-slate-900 px-4 py-2 text-sm transition hover:border-slate-700 hover:bg-slate-800"
              >
                {/* Avatar */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <span className="max-w-35 truncate">
                  Welcome, {userName}
                </span>

                {/* Arrow */}
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">

                  {/* User Info */}
                  <div className="border-b border-slate-800 px-4 py-4">
                    <p className="text-sm font-semibold text-white">
                      Welcome, {userName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {session.user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">

                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Settings
                    </Link>

                    <Link
                      href={`/${session.user.name}`}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Your Page
                    </Link>

                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-slate-800 py-2">
                    <button
                      onClick={() =>
                        signOut({
                          callbackUrl: "/",
                        })
                      }
                      className="w-full px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-slate-800 hover:text-red-300"
                    >
                      Sign out
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            /* Logged out */
            <Link href="/login">
              <button className="bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

