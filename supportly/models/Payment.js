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
      lowercase: true,
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
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Payment =
  mongoose.models.Payment || model("Payment", PaymentSchema);

export default Payment;