
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.trim();

    if (!username) {
      return NextResponse.json(
        { error: "Creator username is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const supporters = await Payment.find({
      to_user: username,
      done: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name message amount createdAt")
      .lean();

    return NextResponse.json({ supporters });
  } catch (error) {
    console.error("Fetch recent supporters error:", error);

    return NextResponse.json(
      { error: "Could not fetch recent supporters." },
      { status: 500 }
    );
  }
}
