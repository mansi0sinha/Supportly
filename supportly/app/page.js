
import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Your own creator page",
    description:
      "Share your story, showcase your work, and give your community one place to support you.",
  },
  {
    number: "02",
    title: "Simple supporter payments",
    description:
      "Give your fans a straightforward way to contribute to the creative work they enjoy.",
  },
  {
    number: "03",
    title: "Support that feels personal",
    description:
      "Let supporters leave a message and make every contribution feel meaningful.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative border-b border-slate-800/70">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16 lg:py-32">
          {/* Left content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3.5 py-2 text-sm text-indigo-300">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              A home for independent creators
            </div>

            <h1 className="mt-7 text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Your creativity.
              <span className="mt-2 block text-indigo-400">
                Their support.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Create a space for your work, bring your community together,
              and let the people who believe in you support what you create.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400"
              >
                Start creating
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/creators"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              >
                Explore creators
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span>
                Your own page
              </span>
              <span className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span>
                Direct support
              </span>
              <span className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span>
                Built for creators
              </span>
            </div>
          </div>

          {/* Right: illustrative product preview */}
          <div className="relative mx-auto w-full max-w-md lg:ml-auto">
            <div className="pointer-events-none absolute inset-8 rounded-full bg-indigo-500/15 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-700/80 bg-slate-900/90 p-4 shadow-2xl shadow-black/30 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-bold">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Supportly</p>
                    <p className="text-xs text-slate-500">Creator preview</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">
                  Example
                </span>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                <div className="relative h-28 overflow-hidden bg-linear-to-br from-indigo-500/40 via-violet-500/20 to-slate-900">
                  <div className="absolute -right-6 -top-14 h-36 w-36 rounded-full border border-white/10" />
                  <div className="absolute -right-1 -top-7 h-24 w-24 rounded-full border border-white/10" />
                  <div className="absolute bottom-0 left-0 h-12 w-full bg-linear-to-t from-slate-950/50 to-transparent" />
                </div>

                <div className="px-5 pb-5">
                  <div className="-mt-9 flex items-end justify-between">
                    <div className="flex h-17 w-17 items-center justify-center rounded-2xl border-4 border-slate-950 bg-indigo-500 text-2xl font-bold shadow-lg">
                      C
                    </div>
                    <span className="mb-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400">
                      Creator page
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold">Creative Studio</h2>
                  <p className="mt-1 text-sm text-slate-500">@creative_studio</p>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    Sharing ideas, building projects, and creating things
                    worth supporting.
                  </p>

                  <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                    <p className="text-sm font-medium">Support this creator</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Choose a sample contribution
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-3 text-center">
                        <p className="text-sm font-semibold">₹50</p>
                      </div>
                      <div className="rounded-lg border border-indigo-400/60 bg-indigo-500/10 px-2 py-3 text-center">
                        <p className="text-sm font-semibold text-indigo-300">
                          ₹100
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-3 text-center">
                        <p className="text-sm font-semibold">₹200</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white">
                      Support creator
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-300">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-medium">Every contribution matters</p>
                  <p className="mt-1 text-xs text-slate-500">
                    A simple way to support creative work.
                  </p>
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-slate-600">
                Illustrative preview · Not a live payment form
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Made for your journey
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Spend less time setting up.
              <span className="block text-slate-400">
                More time creating.
              </span>
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-400">
              Supportly brings your creator profile and supporter experience
              together in one simple place.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-sm font-semibold text-indigo-300">
                  {feature.number}
                </div>
                <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-800/80 bg-slate-900/30 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Simple by design
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              From creating to getting support
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              Three simple steps to get your creator journey started.
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Create your account",
                description:
                  "Sign in and set up your creator profile.",
              },
              {
                number: "02",
                title: "Share your page",
                description:
                  "Let your audience discover your work and your story.",
              },
              {
                number: "03",
                title: "Receive support",
                description:
                  "Give fans a way to contribute through your creator page.",
              },
            ].map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 text-lg font-bold text-indigo-300">
                  {step.number}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 sm:py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-indigo-400/20 bg-slate-900 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[100px]" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Your next chapter starts here
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Make space for the work you love.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Create your Supportly page and invite your community to be
              part of your creative journey.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Create your page →
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Learn about Supportly
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
