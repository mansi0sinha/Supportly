
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export const runtime = "nodejs";

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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
      return NextResponse.json(
        { error: "Invalid payment verification details." },
        { status: 400 }
      );
    }

    const { keyId, keySecret } = getRazorpayConfig();

    // Verify the signature returned by Razorpay Checkout.
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

    // Verify payment and order directly with Razorpay.
    const [payment, order] = await Promise.all([
      razorpay.payments.fetch(razorpay_payment_id),
      razorpay.orders.fetch(razorpay_order_id),
    ]);

    if (
      payment.order_id !== order.id ||
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured"
    ) {
      return NextResponse.json(
        { error: "Payment is not captured for this order." },
        { status: 400 }
      );
    }

    if (
      payment.amount !== order.amount ||
      payment.currency !== order.currency ||
      order.currency !== "INR"
    ) {
      return NextResponse.json(
        { error: "Payment amount or currency mismatch." },
        { status: 400 }
      );
    }

    const creator =
      typeof order.notes?.creator === "string"
        ? order.notes.creator.trim()
        : "";

    const supporterName =
      typeof order.notes?.supporterName === "string"
        ? order.notes.supporterName.trim()
        : "";

    const message =
      typeof order.notes?.message === "string"
        ? order.notes.message
        : "";

    if (!creator || !supporterName) {
      return NextResponse.json(
        { error: "Supporter details are missing from the order." },
        { status: 400 }
      );
    }

    await connectDB();

    // paymentId must have a unique database index in the Payment model.
    const existingPayment = await Payment.findOne({
      paymentId: razorpay_payment_id,
    });

    if (existingPayment) {
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
      amount: payment.amount / 100,
      done: true,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and saved.",
    });
  } catch (error) {
    // A duplicate-key error can occur if simultaneous requests race.
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
