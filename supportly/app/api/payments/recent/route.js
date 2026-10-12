import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const username = searchParams
      .get("username")
      ?.trim()
      .toLowerCase();

    if (!username || !/^[a-z0-9_-]{3,25}$/.test(username)) {
      return NextResponse.json(
        { error: "A valid creator username is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const creatorExists = await User.exists({
      username,
    });

    if (!creatorExists) {
      return NextResponse.json(
        { error: "Creator not found." },
        { status: 404 }
      );
    }

    const supporters = await Payment.find({
      to_user: username,
      done: true,
    })
      .sort({ createdAt: -1, _id: -1 })
      .limit(10)
      .select("name message amount createdAt")
      .lean();

    return NextResponse.json(
      {
        supporters: supporters.map((supporter) => ({
          id: supporter._id.toString(),
          name: supporter.name,
          message: supporter.message || "",
          amount: supporter.amount,
          createdAt: supporter.createdAt,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Fetch recent supporters failed:", {
      message: error.message,
      code: error.code,
      name: error.name,
    });

    return NextResponse.json(
      { error: "Could not fetch recent supporters." },
      { status: 500 }
    );
  }
}