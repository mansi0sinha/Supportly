
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PaymentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    to_user: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    oid: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    paymentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    message: {
      type: String,
      default: "",
      maxlength: 500,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },

    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Reuse the compiled model during Next.js development.
export default mongoose.models.Payment ||
  model("Payment", PaymentSchema);
