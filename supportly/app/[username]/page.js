import React from "react";

const Username = async ({ params }) => {
  const { username } = await params;

  return (
    <main className="min-h-screen bg-white text-slate-900">
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
        <div className="absolute left-1/2 top-[250px] -translate-x-1/2">
          <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
            <img
              src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/aa52624d1cef47ba91c357da4a7859cf/eyJoIjozNjAsInciOjM2MH0%3D/4.gif?token-hash=dZDQ65r7sI-9WNLKTsDhixHJStvr-p6_TFyys_TEQa0%3D&token-time=1791763200"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

    


    <div className="payment">
     </div>
    </main>
  );
};

export default Username;