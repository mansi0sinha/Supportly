import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Supportly",
  description: "A simple platform for creators to get support from their fans.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-950 font-sans text-white">
        <Navbar />

        <main className="relative min-h-[80vh] overflow-hidden">
          {/* Very subtle background */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(79,70,229,0.12),transparent_35%)]" />

          <div className="relative z-10">
            {children}
          </div>
        </main>

        <Footer />
      </body>
    </html>
  );
}