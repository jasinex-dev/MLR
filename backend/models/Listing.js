import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["cabin", "sauna", "activity"], required: true },
    description: { type: String, default: "" },
    pricePerNight: { type: Number, default: "" },
    pricePerSession: { type: Number, default: "" }, 
    capacity: { type: Number, default: "" },
    amenities: [{ type: String }],
    images: [{ type: String }],
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Listing", ListingSchema);
