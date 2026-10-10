import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SessionWrapper from "./components/SessionWrapper";

export const metadata = {
  title: "Supportly",
  description: "A simple platform for creators to get support from their fans.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen bg-slate-950 font-sans text-white">
        <SessionWrapper>
          <Navbar />

          <main className="relative min-h-[80vh] overflow-hidden">
            {/* Very subtle background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(79,70,229,0.12),transparent_35%)]" />

            <div className="relative z-10">
              {children}
            </div>
          </main>

          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}