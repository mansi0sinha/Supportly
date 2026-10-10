
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PaymentSchema = new Schema({
  name: { type: String, required: true },
  to_user: { type: String, required: true, index: true },
  oid: { type: String, required: true },
  paymentId: { type: String, unique: true, sparse: true },
  message: { type: String, default: "" },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  done: { type: Boolean, default: false },
});

export default mongoose.models.Payment ||
  model("Payment", PaymentSchema);
