
import { notFound } from "next/navigation";
import connectDB from "@/db/connectDB";
import User from "@/models/User";
import PaymentPage from "../components/PaymentPage";

export default async function UsernamePage({ params }) {
  const { username } = await params;

  await connectDB();

  const creator = await User.findOne({
    username: username.toLowerCase(),
  })
    .select("name username bio profilepic coverpic")
    .lean();

  if (!creator) {
    notFound();
  }

  const profile = {
    name: creator.name || creator.username,
    username: creator.username,
    bio: creator.bio || "",
    profilePicture: creator.profilepic || "",
    coverPicture: creator.coverpic || "",
  };

  return (
    <PaymentPage
      username={creator.username}
      profile={profile}
    />
  );
}
