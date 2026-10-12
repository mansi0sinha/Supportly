
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9_-]+$/,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 300,
      trim: true,
    },
    profilepic: {
      type: String,
      default: "",
    },
    coverpic: {
      type: String,
      default: "",
    },
    razorpayid: {
      type: String,
      default: "",
    },
    razorpaysecret: {
      type: String,
      default: "",
      select: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || model("User", UserSchema);

export default User;
