
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
  try {
    const { amount, creator, supporterName, message } =
      await request.json();

    const amountValue = Number(amount);

    if (
      !Number.isFinite(amountValue) ||
      amountValue < 1 ||
      amountValue > 100000 ||
      typeof creator !== "string" ||
      !creator.trim() ||
      typeof supporterName !== "string" ||
      !supporterName.trim()
    ) {
      return NextResponse.json(
        { error: "Please provide valid payment details." },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.KEY_SECRET?.trim();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials are missing." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Temporary diagnostic: test Razorpay API authentication.
    console.log("Testing Razorpay API authentication...");

    try {
      const testOrder = await razorpay.orders.create({
        amount: 500,
        currency: "INR",
        receipt: `debug_${Date.now()}`,
      });

      console.log("Razorpay test order succeeded:", testOrder.id);
    } catch (error) {
      console.error("Razorpay test failed:", {
        statusCode: error?.statusCode,
        code: error?.error?.code,
        description: error?.error?.description,
      });

      return NextResponse.json(
        { error: "Razorpay API authentication test failed." },
        { status: 502 }
      );
    }

    // Create the actual order.
    const order = await razorpay.orders.create({
      amount: Math.round(amountValue * 100),
      currency: "INR",
      receipt: `support_${Date.now()}`,
      notes: {
        creator: creator.trim(),
        supporterName: supporterName.trim(),
        message:
          typeof message === "string"
            ? message.trim().slice(0, 500)
            : "",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", {
      statusCode: error?.statusCode,
      code: error?.error?.code,
      description: error?.error?.description,
    });

    return NextResponse.json(
      { error: "Could not create payment order." },
      { status: 500 }
    );
  }
}
