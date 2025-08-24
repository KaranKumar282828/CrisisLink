import mongoose from "mongoose";

const sosSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, default: "Other" }, // e.g. Medical / Accident / Fire / Harassment
  description: { type: String },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  // GeoJSON point (use coordinates: [lng, lat])
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
}, { timestamps: true });

// 2dsphere index for geospatial queries
sosSchema.index({ location: "2dsphere" });

export default mongoose.model("SOS", sosSchema);
