import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "overdue"],
    default: "pending",
  },
});

export default mongoose.model("Rental", rentalSchema);
