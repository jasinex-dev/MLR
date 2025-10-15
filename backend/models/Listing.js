import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["cabin", "sauna", "activity"],
      required: true,
    },
    description: { type: String, default: "" },
    pricePerNight: { type: Number, default: null },
    pricePerSession: { type: Number, default: null },
    capacity: { type: Number, default: null },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", ListingSchema);
