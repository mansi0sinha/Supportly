
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Script from "next/script";

// Safely parse API responses and show useful errors.
async function readApiResponse(response) {
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    console.error("Unexpected API response:", {
      url: response.url,
      status: response.status,
      contentType,
      body: text.slice(0, 300),
    });

    throw new Error(
      `Server error (HTTP ${response.status}). Check your terminal.`
    );
  }

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error("The server returned invalid JSON.");
  }
}

// Handles a username passed normally or accidentally URL-encoded once.
function normalizeUsername(value) {
  if (typeof value !== "string") return "";

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const PaymentPage = ({ username }) => {
  const creatorUsername = useMemo(
    () => normalizeUsername(username).trim(),
    [username]
  );

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [supporterName, setSupporterName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("5");

  const [supporters, setSupporters] = useState([]);
  const [loadingSupporters, setLoadingSupporters] = useState(true);
  const [supportersError, setSupportersError] = useState("");

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch recent supporters independently from the payment form.
  const fetchSupporters = useCallback(async () => {
    if (!creatorUsername) {
      setSupporters([]);
      setSupportersError("Creator username is missing.");
      setLoadingSupporters(false);
      return;
    }

    setLoadingSupporters(true);
    setSupportersError("");

    try {
      const response = await fetch(
        `/api/payments/recent?username=${encodeURIComponent(
          creatorUsername
        )}`,
        { cache: "no-store" }
      );

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Could not load supporters.");
      }

      setSupporters(
        Array.isArray(data.supporters) ? data.supporters : []
      );
    } catch (err) {
      console.error("Fetch supporters error:", err);
      setSupportersError(
        "Recent supporters are temporarily unavailable."
      );
    } finally {
      setLoadingSupporters(false);
    }
  }, [creatorUsername]);

  useEffect(() => {
    fetchSupporters();
  }, [fetchSupporters]);

  const handlePayment = async () => {
    if (paying) return;

    setError("");
    setSuccess("");

    if (!creatorUsername) {
      setError("Creator information is missing. Please refresh.");
      return;
    }

    if (
      !razorpayLoaded ||
      typeof window.Razorpay !== "function"
    ) {
      setError("Payment system is loading. Please try again.");
      return;
    }

    if (!supporterName.trim()) {
      setError("Please enter your name.");
      return;
    }

    const amountValue = Number(amount);

    if (
      !Number.isInteger(amountValue) ||
      amountValue < 1 ||
      amountValue > 100000
    ) {
      setError("Enter a whole-number amount between ₹1 and ₹1,00,000.");
      return;
    }

    setPaying(true);

    try {
      // 1. Create the order on the server.
      const orderResponse = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountValue,
          creator: creatorUsername,
          supporterName: supporterName.trim(),
          message: message.trim(),
        }),
      });

      const orderData = await readApiResponse(orderResponse);

      if (!orderResponse.ok) {
        throw new Error(
          orderData.error || "Could not create payment order."
        );
      }

      if (
        !orderData.orderId ||
        !orderData.keyId ||
        orderData.amount == null
      ) {
        throw new Error("The server returned incomplete order details.");
      }

      let verificationStarted = false;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Supportly",
        description: `Support ${creatorUsername}`,
        order_id: orderData.orderId,

        prefill: {
          name: supporterName.trim(),
        },

        notes: {
          creator: creatorUsername,
          message: message.trim(),
        },

        theme: {
          color: "#6366f1",
        },

        // Never mark a payment successful without backend verification.
        handler: async (paymentResponse) => {
          if (verificationStarted) return;
          verificationStarted = true;

          try {
            const verifyResponse = await fetch(
              "/api/payments/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...paymentResponse,
                  creator: creatorUsername,
                  supporterName: supporterName.trim(),
                  message: message.trim(),
                  amount: amountValue,
                }),
              }
            );

            const verifyData = await readApiResponse(verifyResponse);

            if (
              !verifyResponse.ok ||
              verifyData.success !== true
            ) {
              throw new Error(
                verifyData.error ||
                "Payment verification failed. Check your payment status before trying again."
              );
            }

            setSupporterName("");
            setMessage("");
            setAmount("5");
            setSuccess("Your support has been verified. Thank you!");

            // A supporters-list failure must not undo verified payment success.
            await fetchSupporters();
          } catch (err) {
            console.error("Payment verification error:", err);
            setError(
              err.message ||
              "Could not verify payment. Check its status before retrying."
            );
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error(
          "Razorpay payment failed:",
          response?.error || response
        );

        setError(
          response?.error?.description ||
          "Payment failed. Use a supported payment method and try again."
        );

        setPaying(false);
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Could not start payment.");
      setPaying(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => {
          setRazorpayLoaded(
            typeof window !== "undefined" &&
            typeof window.Razorpay === "function"
          );
        }}
        onError={() => {
          setError("Unable to load Razorpay Checkout. Please refresh.");
        }}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative">
          <div className="h-80 w-full overflow-hidden bg-slate-900">
            <img
              className="h-full w-full object-cover"
              src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/452146dcfeb04f38853368f554aadde1/eyJ3IjoxMjAwLCJ3ZSI6MX0%3D/20.gif?token-hash=5RiPBdX3dYyQVaBBvrlXbWzBSKuciesRYZJfbx2y9mU%3D&token-time=1793750400"
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

        <header className="mt-20 px-4 text-center">
          <h1 className="wrap-break-word text-3xl font-bold">
            {creatorUsername}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Support the creator and their work.
          </p>
        </header>

        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-8 px-6 pb-16 lg:flex-row">
          {/* Recent supporters */}
          <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg lg:w-1/2">
            <h2 className="mb-1 text-xl font-semibold">
              Recent Supporters
            </h2>

            <p className="mb-6 text-sm text-slate-400">
              People who recently supported {creatorUsername}
            </p>

            {loadingSupporters ? (
              <p className="text-sm text-slate-400">
                Loading supporters...
              </p>
            ) : supportersError ? (
              <div className="rounded-xl border border-slate-700 p-5">
                <p className="text-sm text-amber-300">
                  {supportersError}
                </p>
                <button
                  type="button"
                  onClick={fetchSupporters}
                  className="mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Try again
                </button>
              </div>
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
                    key={supporter.id ?? supporter._id}
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
                          {supporter.name || "Anonymous"}
                        </h3>

                        <span className="shrink-0 text-sm font-semibold text-indigo-400">
                          ₹
                          {Number(supporter.amount).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {supporter.message && (
                        <p className="mt-1 wrap-break-word text-sm text-slate-400">
                          {supporter.message}
                        </p>
                      )}

                      {supporter.createdAt && (
                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(
                            supporter.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Payment form */}
          <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg lg:w-1/2">
            <h2 className="mb-1 text-xl font-semibold">
              Support {creatorUsername}
            </h2>

            <p className="mb-6 text-sm text-slate-400">
              Choose an amount and leave a message to show your support.
            </p>

            <div className="mb-4">
              <label
                htmlFor="supporter-name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Your name
              </label>

              <input
                id="supporter-name"
                type="text"
                maxLength={100}
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="support-message"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Message (optional)
              </label>

              <textarea
                id="support-message"
                rows={4}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message..."
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="support-amount"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Amount (INR)
              </label>

              <div className="flex gap-3">
                <div className="relative min-w-0 flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ₹
                  </span>

                  <input
                    id="support-amount"
                    type="number"
                    min="1"
                    max="100000"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-3 pl-9 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {[5, 10].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(String(value))}
                    className={`rounded-lg border px-4 text-sm font-medium transition ${amount === String(value)
                        ? "border-indigo-500 text-white"
                        : "border-slate-700 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white"
                      }`}
                  >
                    ₹{value}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mb-4 wrap-break-word rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300"
              >
                {success}
              </p>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={!razorpayLoaded || paying || !creatorUsername}
              className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!razorpayLoaded
                ? "Loading payment..."
                : paying
                  ? "Processing..."
                  : `Pay ₹${amount || "0"} & Support`}
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              Payments appear in Recent Supporters only after server-side
              verification.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default PaymentPage;
