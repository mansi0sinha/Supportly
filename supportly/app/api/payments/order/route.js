
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "node:crypto";

export const runtime = "nodejs";

const MIN_AMOUNT_RUPEES = 1;
const MAX_AMOUNT_RUPEES = 100000;

function getRazorpayConfig() {
  const keyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID;

  const keySecret =
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay server configuration is missing.");
  }

  return { keyId, keySecret };
}

export async function POST(request) {
  try {
    const body = await request.json();

    const creator =
      typeof body.creator === "string" ? body.creator.trim() : "";

    const supporterName =
      typeof body.supporterName === "string"
        ? body.supporterName.trim()
        : "";

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const amountValue = Number(body.amount);

    if (
      !creator ||
      creator.length > 100 ||
      !supporterName ||
      supporterName.length > 100 ||
      message.length > 500 ||
      !Number.isSafeInteger(amountValue) ||
      amountValue < MIN_AMOUNT_RUPEES ||
      amountValue > MAX_AMOUNT_RUPEES
    ) {
      return NextResponse.json(
        { error: "Invalid payment details." },
        { status: 400 }
      );
    }

    // Use server-side credentials. Never expose the secret to the browser.
    const { keyId, keySecret } = getRazorpayConfig();

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // A short unique receipt helps identify this order in Razorpay.
    const receipt = `sup_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;

    const order = await razorpay.orders.create({
      amount: amountValue * 100,
      currency: "INR",
      receipt,
      notes: {
        creator,
        supporterName,
        message,
      },
    });

    if (
      !order?.id ||
      order.amount !== amountValue * 100 ||
      order.currency !== "INR"
    ) {
      console.error("Razorpay returned unexpected order details.");

      return NextResponse.json(
        { error: "Razorpay returned invalid order details." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", {
      message: error.message,
      statusCode: error.statusCode,
      errorCode: error.error?.code,
    });

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create payment order." },
      { status: 500 }
    );
  }
}
