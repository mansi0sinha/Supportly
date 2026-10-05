import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import User from "@/models/User";
import connectDB from "@/db/connectDB";

export const authoptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        await connectDB();

        const email = user.email || profile?.email;

        if (!email) {
          console.log("GitHub did not provide an email");
          return false;
        }

        const username = email.split("@")[0];

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          const newUser = new User({
            email: email,
            username: username,
          });

          await newUser.save();
          user.name = newUser.username;
        } else {
          user.name = existingUser.username;
        }
      }

      return true;
    },

    async session({ session }) {
      await connectDB();

      const dbUser = await User.findOne({
        email: session.user.email,
      });

      if (dbUser) {
        session.user.name = dbUser.username;
      }

      return session;
    },
  },
});

export { authoptions as GET, authoptions as POST };