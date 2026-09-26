import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Supportly
        </p>

        <p className="hidden text-sm text-slate-600 sm:block">
          Built for creators.
        </p>

      </div>
    </footer>
  );
};

export default Footer;