import { NextResponse } from "next/server";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Payment from "@/models/Payment";

export const runtime = "nodejs";

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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !razorpay_order_id.trim() ||
      !razorpay_payment_id.trim() ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
      return NextResponse.json(
        { error: "Invalid payment verification details." },
        { status: 400 }
      );
    }

    const { keyId, keySecret } = getRazorpayConfig();

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest();

    const receivedSignature = Buffer.from(
      razorpay_signature,
      "hex"
    );

    if (
      expectedSignature.length !== receivedSignature.length ||
      !crypto.timingSafeEqual(
        expectedSignature,
        receivedSignature
      )
    ) {
      return NextResponse.json(
        { error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const [razorpayPayment, order] = await Promise.all([
      razorpay.payments.fetch(razorpay_payment_id),
      razorpay.orders.fetch(razorpay_order_id),
    ]);

    if (
      order.id !== razorpay_order_id ||
      razorpayPayment.order_id !== order.id ||
      razorpayPayment.status !== "captured"
    ) {
      return NextResponse.json(
        { error: "Payment is not captured for this order." },
        { status: 400 }
      );
    }

    if (
      !Number.isSafeInteger(order.amount) ||
      order.amount < 100 ||
      order.amount > 10000000 ||
      razorpayPayment.amount !== order.amount ||
      razorpayPayment.currency !== order.currency ||
      order.currency !== "INR"
    ) {
      return NextResponse.json(
        { error: "Payment amount or currency mismatch." },
        { status: 400 }
      );
    }

    const creator =
      typeof order.notes?.creator === "string"
        ? order.notes.creator.trim().toLowerCase()
        : "";

    const supporterName =
      typeof order.notes?.supporterName === "string"
        ? order.notes.supporterName.trim()
        : "";

    const message =
      typeof order.notes?.message === "string"
        ? order.notes.message.trim()
        : "";

    if (
      !/^[a-z0-9_-]{3,25}$/.test(creator) ||
      !supporterName ||
      supporterName.length > 100 ||
      message.length > 500
    ) {
      return NextResponse.json(
        { error: "Supporter details are missing or invalid." },
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

    const existingPayment = await Payment.findOne({
      paymentId: razorpay_payment_id,
    }).lean();

    if (existingPayment) {
      const matches =
        existingPayment.oid === razorpay_order_id &&
        existingPayment.to_user === creator &&
        existingPayment.amount === razorpayPayment.amount / 100 &&
        existingPayment.done === true;

      if (!matches) {
        return NextResponse.json(
          { error: "Payment ID conflicts with an existing record." },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Payment was already verified.",
      });
    }

    await Payment.create({
      paymentId: razorpay_payment_id,
      name: supporterName,
      to_user: creator,
      oid: razorpay_order_id,
      message,
      amount: razorpayPayment.amount / 100,
      done: true,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and saved.",
    });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json({
        success: true,
        message: "Payment was already verified.",
      });
    }

    console.error("Payment verification failed:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    });

    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 }
    );
  }
}