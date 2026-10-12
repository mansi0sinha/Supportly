import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="min-h-[80vh] px-6 py-24 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
          About Supportly
        </p>

        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
          Helping creators grow through community support.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Supportly is a creator-support platform where people can
          discover creators, visit their public pages, and contribute
          financially to the work they enjoy.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">For creators</h2>
            <p className="mt-3 leading-7 text-slate-400">
              Build your profile, share your work, and receive support
              from your community.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">For supporters</h2>
            <p className="mt-3 leading-7 text-slate-400">
              Discover creators you care about and support their work
              through a simple payment experience.
            </p>
          </div>
        </div>

        <Link
          href="/creators"
          className="mt-10 inline-flex rounded-lg bg-indigo-500 px-6 py-3 font-semibold hover:bg-indigo-400"
        >
          Explore creators
        </Link>
      </div>
    </section>
  );
}