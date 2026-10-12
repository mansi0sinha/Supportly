
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import connectDB from "@/db/connectDB";

export async function POST(request) {
  try {
    // 1. Read registration details
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request data." },
        { status: 400 }
      );
    }

    const name = String(body.name || "").trim();
    const username = String(body.username || "").trim().toLowerCase();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    // 2. Validate required fields
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Please fill in all fields." },
        { status: 400 }
      );
    }

    if (name.length > 80) {
      return NextResponse.json(
        { error: "Name must be 80 characters or fewer." },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 25) {
      return NextResponse.json(
        { error: "Username must be between 3 and 25 characters." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can contain letters, numbers, underscores and hyphens only." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters and no more than 72 bytes." },
        { status: 400 }
      );
    }

    // 3. Connect to MongoDB
    await connectDB();

    // 4. Check whether the email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).lean();

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "This username is already taken." },
        { status: 409 }
      );
    }

    // 5. Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 12);

    // 6. Create the user using your existing User model
    const user = await User.create({
      name,
      username,
      email,
      passwordHash,
    });

    // 7. Return success without exposing the password hash
    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Unique indexes also protect against simultaneous registrations.
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      return NextResponse.json(
        {
          error:
            field === "email"
              ? "An account with this email already exists."
              : field === "username"
                ? "This username is already taken."
                : "An account with these details already exists.",
        },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Please check your registration details." },
        { status: 400 }
      );
    }

    console.error("Registration error:", error.message);

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
