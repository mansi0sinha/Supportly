
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/db/connectDB";
import User from "@/models/User";

export const runtime = "nodejs";

async function getAuthenticatedUser(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.userId) {
    return null;
  }

  await connectDB();

  return User.findById(token.userId);
}

// Load the logged-in creator's profile.
export async function GET(req) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      profile: {
        name: user.name || "",
        email: user.email,
        username: user.username,
        bio: user.bio || "",
        profilePicture: user.profilepic || "",
        coverPicture: user.coverpic || "",
      },
    });
  } catch (error) {
    console.error("Load profile failed:", error.message);

    return NextResponse.json(
      { error: "Unable to load your profile." },
      { status: 500 }
    );
  }
}

// Save the logged-in creator's profile.
export async function PUT(req) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const username = String(body.username ?? "")
      .trim()
      .toLowerCase();
    const bio = String(body.bio ?? "").trim();
    const profilepic = String(body.profilePicture ?? "").trim();
    const coverpic = String(body.coverPicture ?? "").trim();

    if (!name || name.length > 80) {
      return NextResponse.json(
        { error: "Name is required and must be at most 80 characters." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_-]{3,25}$/.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username must be 3–25 characters using letters, numbers, underscores or hyphens.",
        },
        { status: 400 }
      );
    }

    if (bio.length > 300) {
      return NextResponse.json(
        { error: "Bio must be at most 300 characters." },
        { status: 400 }
      );
    }

    for (const url of [profilepic, coverpic]) {
      if (url && !/^https?:\/\/\S+$/i.test(url)) {
        return NextResponse.json(
          { error: "Picture URLs must start with http:// or https://." },
          { status: 400 }
        );
      }
    }

    const duplicate = await User.findOne({
      username,
      _id: { $ne: user._id },
    }).select("_id");

    if (duplicate) {
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 }
      );
    }

    user.name = name;
    user.username = username;
    user.bio = bio;
    user.profilepic = profilepic;
    user.coverpic = coverpic;

    await user.save();

    return NextResponse.json({
      message: "Profile saved successfully.",
      profile: {
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilepic,
        coverPicture: user.coverpic,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 }
      );
    }

    console.error("Save profile failed:", error.message);

    return NextResponse.json(
      { error: "Unable to save your profile." },
      { status: 500 }
    );
  }
}
