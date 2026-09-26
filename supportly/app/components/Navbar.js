import React from "react";

const Navbar = () => {
  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-950 text-white">
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
            <a
              href="/"
              className="transition hover:text-white"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="/about"
              className="transition hover:text-white"
            >
              About
            </a>
          </li>

          <li>
            <a
              href="/creators"
              className="transition hover:text-white"
            >
              Creators
            </a>
          </li>
        </ul>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
         <button className="bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
            Login
          </button>

          <button className="bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;