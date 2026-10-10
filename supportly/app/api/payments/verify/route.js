
import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing payment verification details" },
        { status: 400 }
      );
    }

    const secret = process.env.KEY_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: "Razorpay secret is not configured" },
        { status: 500 }
      );
    }

    // Verify Razorpay's payment signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const signaturesMatch =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );

    if (!signaturesMatch) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Confirm payment status with Razorpay's server
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: secret,
    });

    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured"
    ) {
      return NextResponse.json(
        { error: "Payment has not been captured" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await razorpay.orders.fetch(razorpay_order_id);

    if (
      payment.amount !== order.amount ||
      payment.currency !== order.currency
    ) {
      return NextResponse.json(
        { error: "Payment amount or currency mismatch" },
        { status: 400 }
      );
    }

    const creator = order.notes?.creator;
    const supporterName = order.notes?.supporterName;
    const message = order.notes?.message || "";

    if (!creator || !supporterName) {
      return NextResponse.json(
        { error: "Supporter details are missing" },
        { status: 400 }
      );
    }

    // Avoid saving the same payment more than once.
    // Add paymentId to your model for reliable duplicate protection.
    const existingPayment = await Payment.findOne({
      oid: razorpay_order_id,
      name: supporterName,
      to_user: creator,
    });

    if (!existingPayment) {
      await Payment.create({
        name: supporterName,
        to_user: creator,
        oid: razorpay_order_id,
        message,
        amount: payment.amount / 100,
        done: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and saved",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify payment" },
      { status: 500 }
    );
  }
}
