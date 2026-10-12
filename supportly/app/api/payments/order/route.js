import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

const MIN_AMOUNT_RUPEES = 1;
const MAX_AMOUNT_RUPEES = 100000;

function getRazorpayConfig() {
  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay server configuration is missing.");
  }

  return { keyId, keySecret };
}

export async function POST(request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const creator =
      typeof body.creator === "string"
        ? body.creator.trim().toLowerCase()
        : "";

    const supporterName =
      typeof body.supporterName === "string"
        ? body.supporterName.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const amountValue = Number(body.amount);

    if (
      !/^[a-z0-9_-]{3,25}$/.test(creator) ||
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

    await connectDB();

    const creatorExists = await User.exists({
      username: creator,
    });

    if (!creatorExists) {
      return NextResponse.json(
        { error: "Creator not found." },
        { status: 404 }
      );
    }

    const { keyId, keySecret } = getRazorpayConfig();

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = amountValue * 100;
    const receipt = `sup_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
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
      order.amount !== amountInPaise ||
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

    return NextResponse.json(
      { error: "Unable to create payment order." },
      { status: 500 }
    );
  }
}