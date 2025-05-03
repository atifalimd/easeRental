import mongoose from "mongoose";

const EarningSchema = new mongoose.Schema(
  {
    landlordId: {
      type: String,
      required: true,
    },
    listingId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Earning", EarningSchema);
