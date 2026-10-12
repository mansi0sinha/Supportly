import Link from "next/link";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export default async function CreatorsPage() {
  let creators = [];

  try {
    await connectDB();

    creators = await User.find({})
      .select("name username bio profilepic")
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
  } catch (error) {
    console.error("Failed to load creators:", error);
  }

  return (
    <section className="min-h-[80vh] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
          Community
        </p>

        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Discover creators
        </h1>

        <p className="mt-4 text-slate-400">
          Find creators and support the work they share with the world.
        </p>

        {creators.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
            <h2 className="text-xl font-semibold">No creators to show yet</h2>
            <p className="mt-3 text-slate-400">
              Creator profiles will appear here when accounts are available.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex rounded-lg bg-indigo-500 px-6 py-3 font-semibold hover:bg-indigo-400"
            >
              Get started
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator) => (
              <article
                key={creator._id.toString()}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-indigo-500/50"
              >
                {creator.profilepic ? (
                  <img
                    src={creator.profilepic}
                    alt=""
                    className="h-16 w-16 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-2xl font-bold text-indigo-300">
                    {(creator.name || creator.username || "?")[0].toUpperCase()}
                  </div>
                )}

                <h2 className="mt-4 text-xl font-semibold">
                  {creator.name || creator.username}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  @{creator.username}
                </p>

                <p className="mt-3 line-clamp-3 min-h-12 leading-6 text-slate-400">
                  {creator.bio || "This creator hasn't added a bio yet."}
                </p>

                <Link
                  href={`/${creator.username}`}
                  className="mt-5 inline-flex text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  View profile →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}