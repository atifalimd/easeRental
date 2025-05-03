import mongoose from "mongoose";

const ActiveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  amount: Number,
  status: {
    type: String,
    enum: ["active", "pending"],
    default: "active",
  },
  userRef: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Active", ActiveSchema);
