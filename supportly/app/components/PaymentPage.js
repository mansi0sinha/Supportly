
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Script from "next/script";

const PaymentPage = ({ username }) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [supporterName, setSupporterName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("5");
  const [supporters, setSupporters] = useState([]);
  const [loadingSupporters, setLoadingSupporters] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const fetchSupporters = useCallback(async () => {
    if (!username) return;

    try {
      setLoadingSupporters(true);

      const response = await fetch(
        `/api/payments/recent?username=${encodeURIComponent(username)}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load supporters.");
      }

      setSupporters(data.supporters || []);
    } catch (err) {
      console.error("Fetch supporters error:", err);
      setError("Could not load recent supporters.");
    } finally {
      setLoadingSupporters(false);
    }
  }, [username]);

  useEffect(() => {
    fetchSupporters();
  }, [fetchSupporters]);

  const handlePayment = async () => {
    if (paying) return;

    setError("");

    if (!razorpayLoaded || typeof window.Razorpay !== "function") {
      setError("Payment system is still loading. Please try again.");
      return;
    }

    if (!supporterName.trim()) {
      setError("Please enter your name.");
      return;
    }

    const amountValue = Number(amount);

    if (!Number.isFinite(amountValue) || amountValue < 1 || amountValue > 100000) {
      setError("Enter an amount between ₹1 and ₹1,00,000.");
      return;
    }

    setPaying(true);

    try {
      // Step 1: Create an order on the server.
      const orderResponse = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountValue,
          creator: username,
          supporterName: supporterName.trim(),
          message: message.trim(),
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Could not create payment order.");
      }

      // Step 2: Open Razorpay Checkout using the server-created order.
      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Supportly",
        description: `Support ${username}`,
        order_id: orderData.orderId,
        prefill: {
          name: supporterName.trim(),
        },
        notes: {
          creator: username,
          message: message.trim(),
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
        handler: async (paymentResponse) => {
          try {
            // Step 3: Verify the payment on the server.
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(paymentResponse),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.error || "Payment verification failed."
              );
            }

            setSupporterName("");
            setMessage("");
            setAmount("5");

            await fetchSupporters();

            alert("Thank you! Your support has been verified.");
          } catch (err) {
            console.error("Payment verification error:", err);
            setError(
              err.message ||
                "Payment verification failed. Please contact support if you were charged."
            );
          } finally {
            setPaying(false);
          }
        },
      });

      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response.error);
        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        );
        setPaying(false);
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Could not start payment. Please try again.");
      setPaying(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => {
          if (typeof window.Razorpay === "function") {
            setRazorpayLoaded(true);
          }
        }}
        onError={() => {
          setError("Unable to load Razorpay Checkout. Please refresh.");
        }}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        {/* Cover */}
        <section className="relative">
          <div className="h-80 w-full overflow-hidden bg-slate-900">
            <img
              className="h-full w-full object-cover"
              src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/452146dcfeb04f38853368f554aadde1/eyJ3Ijo2MjAsIndlIjoxfQ%3D%3D/20.gif?token-hash=f-wW2KxR9EJB93MleJDPi5Nxa5bu1QEemxoR_DkNxsM%3D&token-time=1791072000"
              alt="Creator cover"
            />
          </div>

          <div className="absolute left-1/2 top-62.5 -translate-x-1/2">
            <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-slate-950 bg-slate-800 shadow-xl">
              <img
                src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/aa52624d1cef47ba91c357da4a7859cf/eyJoIjozNjAsInciOjM2MH0%3D/4.gif?token-hash=dZDQ65r7sI-9WNLKTsDhixHJStvr-p6_TFyys_TEQa0%3D&token-time=1791763200"
                alt="Creator profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <div className="mt-20 px-4 text-center">
          <h1 className="text-3xl font-bold">{username}</h1>
          <p className="mt-2 text-sm text-slate-400">
            Support the creator and their work.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-8 px-6 pb-16 lg:flex-row">
          {/* Recent Supporters */}
          <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg lg:w-1/2">
            <h2 className="mb-1 text-xl font-semibold">
              Recent Supporters
            </h2>

            <p className="mb-6 text-sm text-slate-400">
              People who recently supported {username}
            </p>

            {loadingSupporters ? (
              <p className="text-sm text-slate-400">
                Loading supporters...
              </p>
            ) : supporters.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                <p className="font-medium text-slate-300">
                  No supporters yet
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Be the first to support this creator!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {supporters.map((supporter) => (
                  <div
                    key={supporter._id}
                    className="flex gap-4 rounded-xl border border-slate-800 bg-slate-800/40 p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                      {(supporter.name || "?")
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate font-medium">
                          {supporter.name}
                        </h3>
                        <span className="shrink-0 text-sm font-semibold text-indigo-400">
                          ₹{Number(supporter.amount).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {supporter.message && (
                        <p className="mt-1 break-words text-sm text-slate-400">
                          {supporter.message}
                        </p>
                      )}

                      {supporter.createdAt && (
                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(supporter.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Make Payment */}
          <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg lg:w-1/2">
            <h2 className="mb-1 text-xl font-semibold">
              Support {username}
            </h2>

            <p className="mb-6 text-sm text-slate-400">
              Choose an amount and leave a message to show your support.
            </p>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Your name
              </label>
              <input
                type="text"
                maxLength={100}
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Message (optional)
              </label>
              <textarea
                rows={4}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message..."
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Amount (INR)
              </label>

              <div className="flex gap-3">
                <div className="relative min-w-0 flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-3 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setAmount("5")}
                  className={`rounded-lg border px-4 text-sm font-medium transition ${
                    amount === "5"
                      ? "border-indigo-500 text-white"
                      : "border-slate-700 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white"
                  }`}
                >
                  ₹5
                </button>

                <button
                  type="button"
                  onClick={() => setAmount("10")}
                  className={`rounded-lg border px-4 text-sm font-medium transition ${
                    amount === "10"
                      ? "border-indigo-500 text-white"
                      : "border-slate-700 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white"
                  }`}
                >
                  ₹10
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={!razorpayLoaded || paying}
              className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!razorpayLoaded
                ? "Loading payment..."
                : paying
                  ? "Processing..."
                  : `Pay ₹${amount || "0"} & Support`}
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              Payments are verified securely before appearing in Recent Supporters.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default PaymentPage;
