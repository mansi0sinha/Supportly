
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import connectDB from "@/db/connectDB";

async function getOrCreateOAuthUser(user) {
  const email = String(user.email || "").trim().toLowerCase();

  if (!email) {
    throw new Error(
      "Your provider did not supply an email address. Enable email access and try again."
    );
  }

  let dbUser = await User.findOne({ email });

  if (!dbUser) {
    const base = (
      email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "") ||
      "creator"
    ).slice(0, 25);

    let username = base;
    let suffix = 1;

    while (await User.exists({ username })) {
      const ending = String(suffix++);
      username = `${base.slice(0, 25 - ending.length)}${ending}`;
    }

    dbUser = await User.create({
      email,
      name: user.name || username,
      username,
      profilepic: user.image || "",
    });
  } else {
    if (!dbUser.name && user.name) dbUser.name = user.name;
    if (!dbUser.profilepic && user.image) dbUser.profilepic = user.image;
    await dbUser.save();
  }

  user.id = dbUser._id.toString();
  user.username = dbUser.username;
}

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password || "");

        if (!email || !password) return null;

        await connectDB();

        const dbUser = await User.findOne({ email }).select("+passwordHash");

        if (!dbUser?.passwordHash) return null;

        const passwordMatches = await bcrypt.compare(
          password,
          dbUser.passwordHash
        );

        if (!passwordMatches) return null;

        return {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          username: dbUser.username,
          image: dbUser.profilepic || null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();

        if (account?.provider === "credentials") {
          // CredentialsProvider has already verified the password.
          return true;
        }

        if (
          account?.provider === "github" ||
          account?.provider === "google"
        ) {
          await getOrCreateOAuthUser(user);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Sign-in error:", error.message);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.username = token.username;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
