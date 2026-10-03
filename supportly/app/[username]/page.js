import React from "react";

const Username = async ({ params }) => {
  const { username } = await params;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-900">
      {/* Cover */}
      <section className="relative">
        <div className="h-80 w-full overflow-hidden bg-slate-200">
          <img
            className="h-full w-full object-cover"
            src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/452146dcfeb04f38853368f554aadde1/eyJ3Ijo2MjAsIndlIjoxfQ%3D%3D/20.gif?token-hash=f-wW2KxR9EJB93MleJDPi5Nxa5bu1QEemxoR_DkNxsM%3D&token-time=1791072000"
            alt="Cover"
          />
        </div>

        {/* Profile picture */}
        <div className="absolute left-1/2 top-62.5 -translate-x-1/2">
          <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
            <img
              src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/aa52624d1cef47ba91c357da4a7859cf/eyJoIjozNjAsInciOjM2MH0%3D/4.gif?token-hash=dZDQ65r7sI-9WNLKTsDhixHJStvr-p6_TFyys_TEQa0%3D&token-time=1791763200"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>


      <div className="mx-auto mt-24 flex max-w-6xl flex-col gap-8 px-6 pb-16 lg:flex-row">


        {/* Supporters */}
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg lg:w-1/2">
          <h2 className="mb-1 text-xl font-semibold text-white">
            Recent Supporters
          </h2>

          <p className="mb-6 text-sm text-slate-400">
            People who recently supported {username}
          </p>

          <div className="space-y-4">

            {/* Supporter 1 */}
            <div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-800/40 p-4">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-indigo-600">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Aarav"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-white">
                    Aarav
                  </h3>

                  <span className="text-sm font-semibold text-indigo-400">
                    $10
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  "Keep creating! Really enjoying your work."
                </p>
              </div>
            </div>

            {/* Supporter 2 */}
            <div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-800/40 p-4">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-indigo-600">
                <img
                  src="https://i.pravatar.cc/150?img=32"
                  alt="Priya"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-white">
                    Priya
                  </h3>

                  <span className="text-sm font-semibold text-indigo-400">
                    $20
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  "Your content has been really helpful. Keep going!"
                </p>
              </div>
            </div>

            {/* Supporter 3 */}
            <div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-800/40 p-4">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-indigo-600">
                <img
                  src="https://i.pravatar.cc/150?img=56"
                  alt="Rahul"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-white">
                    Rahul
                  </h3>

                  <span className="text-sm font-semibold text-indigo-400">
                    $5
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  "Small contribution, big support. All the best!"
                </p>
              </div>
            </div>

          </div>
        </div>




        {/* Make Payment */}
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg lg:w-1/2">
          <h2 className="mb-1 text-xl font-semibold text-white">
            Support {username}
          </h2>

          <p className="mb-6 text-sm text-slate-400">
            Choose an amount and leave a message to show your support.
          </p>

          {/* Name */}
          <div className="mb-4">


            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {/* Message */}
          <div className="mb-1">


            <textarea
              rows="4"
              placeholder="Write a message..."
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {/* Amount */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Amount
            </label>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  $
                </span>

                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-3 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="button"
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm font-medium text-slate-300 transition hover:border-indigo-500 hover:text-white"
              >
                $5
              </button>

              <button
                type="button"
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm font-medium text-slate-300 transition hover:border-indigo-500 hover:text-white"
              >
                $10
              </button>
            </div>
          </div>



          {/* Pay Button */}
          <button
            type="button"
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Pay & Support
          </button>
        </div>


      </div>

    </main>
  );
};

export default Username;