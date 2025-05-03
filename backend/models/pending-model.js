import mongoose from "mongoose";

const PendingSchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
  },
  landlordId: {
    type: String,
    required: true,
  },
  tenantId: {
    type: String,
    required: true,
  },

  message: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Pending", PendingSchema);
