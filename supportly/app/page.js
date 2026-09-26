
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6">
        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-10 h-125 w-125 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* Heading */}
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Get supported for
            <span className="block text-indigo-400">
              what you create.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Supportly gives creators a simple way to receive support directly
            from their fans and followers. Create your page, share it, and
            focus on what you love creating.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-lg bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-400">
              Start Now
            </button>

            <button className="rounded-lg border border-slate-700 bg-slate-900/70 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800">
              Read More
            </button>
          </div>

          {/* Supporting Text */}
          <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
            <span>Simple</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>Direct</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>Creator-first</span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto h-px max-w-6xl bg-slate-800" />

      {/* How It Works */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">

          {/* Section Heading */}
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              How Supportly works
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your fans can support you
            </h2>

            <p className="mt-4 text-slate-400">
              A simple way to turn the people who enjoy your work into
              supporters.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-6 md:grid-cols-3">

            {/* Card 1 */}
           
<div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center transition hover:-translate-y-1 hover:border-slate-700">
  
  <div className="mb-6 flex h-24 items-center justify-center">
    <img
      src="/man.png"
      alt="Creator"
      className="h-full w-full object-contain"
    />
  </div>

  <h3 className="text-xl font-semibold">
    Your fans want to help
  </h3>

  <p className="mt-3 leading-7 text-slate-400">
    Your fans are available for your help.
  </p>
</div>

           {/* Card 2 */}
<div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center transition hover:-translate-y-1 hover:border-slate-700">
  
  <div className="mb-6 flex h-24 items-center justify-center">
    <img
      src="/coin.png"
      alt="coin"
      className="h-full w-full object-contain"
    />
  </div>

  <h3 className="text-xl font-semibold">
    Share with your fans
  </h3>

  <p className="mt-3 leading-7 text-slate-400">
    Share your Supportly page anywhere and let the people who
    enjoy your work support you directly.
  </p>
</div>

           {/* Card 3 */}
<div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center transition hover:-translate-y-1 hover:border-slate-700 ">
  
  <div className="mb-6 flex h-24 items-center justify-center ">
    <img
      src="/group.png"
      alt="Fans"
      className="h-full w-full object-contain "
    />
  </div>

  <h3 className="text-xl font-semibold">
    Share with your fans
  </h3>

  <p className="mt-3 leading-7 text-slate-400">
    Share your Supportly page anywhere and let the people who
    enjoy your work support you directly.
  </p>
</div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/60 px-6 py-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to start creating?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Create your Supportly page and give your fans a simple way to
            support what you do.
          </p>

          <button className="mt-8 rounded-lg bg-indigo-500 px-8 py-3.5 text-sm font-semibold transition hover:bg-indigo-400">
            Create Your Page
          </button>
        </div>
      </section>
    </main>
  );
}

