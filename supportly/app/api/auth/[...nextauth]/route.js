
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import User from "@/models/User";
import connectDB from "@/db/connectDB";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "github") {
        return false;
      }

      try {
        await connectDB();

        const email = (user.email || profile?.email || "")
          .trim()
          .toLowerCase();

        if (!email) {
          console.error(
            "GitHub did not provide an email. Login cannot continue."
          );
          return false;
        }

        // Find the existing database account.
        let dbUser = await User.findOne({ email });

        if (!dbUser) {
          const baseUsername = (
            email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "") ||
            "creator"
          ).slice(0, 25);

          let username = baseUsername;
          let suffix = 1;

          // Avoid username collisions.
          while (await User.exists({ username })) {
            username = `${baseUsername.slice(0, 25)}${suffix}`;
            suffix++;
          }

          dbUser = await User.create({
            email,
            name: user.name || username,
            username,
            profilepic: user.image || "",
          });
        } else {
          // Populate missing profile information without
          // overwriting settings the user already saved.
          if (!dbUser.name && user.name) {
            dbUser.name = user.name;
          }

          if (!dbUser.profilepic && user.image) {
            dbUser.profilepic = user.image;
          }

          await dbUser.save();
        }

        // Available to the JWT callback.
        user.id = dbUser._id.toString();
        user.username = dbUser.username;

        return true;
      } catch (error) {
        console.error("GitHub sign-in failed:", error.message);
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
