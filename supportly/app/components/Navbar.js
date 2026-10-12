"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "User";

  // Use the database username, not the display name.
  const username = session?.user?.username;

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMenus = () => {
    setIsOpen(false);
    setMobileOpen(false);
  };

  const navLinkClass =
    "text-sm text-slate-400 transition hover:text-white";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-2"
          aria-label="Supportly home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold">
            S
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Supportly
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className={navLinkClass}>
            Home
          </Link>
          <Link href="/about" className={navLinkClass}>
            About
          </Link>
          <Link href="/creators" className={navLinkClass}>
            Creators
          </Link>
        </div>

        {/* Desktop account menu */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "loading" ? (
            <span className="text-sm text-slate-500">
              Loading account...
            </span>
          ) : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className="flex max-w-64 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm transition hover:border-slate-700 hover:bg-slate-800"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>

                <span className="max-w-36 truncate">
                  {userName}
                </span>

                <svg
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="m6 9 6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>

              {isOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl"
                >
                  <div className="border-b border-slate-800 px-4 py-4">
                    <p className="truncate text-sm font-semibold text-white">
                      {userName}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {session.user?.email}
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      role="menuitem"
                      onClick={closeMenus}
                      className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/settings"
                      role="menuitem"
                      onClick={closeMenus}
                      className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      Settings
                    </Link>

                    {username && (
                      <Link
                        href={`/${encodeURIComponent(username)}`}
                        role="menuitem"
                        onClick={closeMenus}
                        className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        Your Public Page
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-800 p-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() =>
                        signOut({ callbackUrl: "/" })
                      }
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-200 hover:bg-slate-900 md:hidden"
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
              <path d="m6 6 12 12M18 6 6 18" strokeWidth={2} strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
              <path d="M4 7h16M4 12h16M4 17h16" strokeWidth={2} strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            <Link href="/" onClick={closeMenus} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-900">
              Home
            </Link>
            <Link href="/about" onClick={closeMenus} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-900">
              About
            </Link>
            <Link href="/creators" onClick={closeMenus} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-900">
              Creators
            </Link>

            {status === "loading" ? (
              <p className="px-3 py-3 text-sm text-slate-500">
                Loading account...
              </p>
            ) : session ? (
              <>
                <div className="my-2 border-t border-slate-800" />
                <Link href="/dashboard" onClick={closeMenus} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-900">
                  Dashboard
                </Link>
                <Link href="/settings" onClick={closeMenus} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-900">
                  Settings
                </Link>
                {username && (
                  <Link href={`/${encodeURIComponent(username)}`} onClick={closeMenus} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-900">
                    Your Public Page
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-lg px-3 py-3 text-left text-sm text-red-400 hover:bg-slate-900"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={closeMenus} className="mt-2 rounded-lg bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-400">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}