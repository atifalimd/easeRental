import mongoose from "mongoose";

const TenantPreferenceSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each tenant should have only one preferences document
    },
    propertyType: {
      type: String,
      enum: ["apartment", "house", "studio", "villa", "any"],
      default: "any",
    },
    preferredLocations: {
      type: [String], // Multiple locations
      default: [],
    },
    budget: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 999999 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("TenantPreference", TenantPreferenceSchema);
