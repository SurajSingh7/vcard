import mongoose from "mongoose";

const TrackLogSchema = new mongoose.Schema(
  {
    track: {
      type: String,
      match: /^[0-9]+$/, // Only digits allowed
    },
    DateTime: {
      type: Date,
      default: Date.now, 
    },
    oldScheduledDate: {
      type: Date,
      required: true,
    },
    newScheduledDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    privateIp: {
      type: String,
    },
    publicIp: {
      type: String,
    },
    vcid: {
      type: mongoose.Schema.Types.ObjectId, // Reference to visitorCard _id
      required: true,
      ref: "VisitorCard",
    },
  },
  { timestamps: true }
);

// Prevent model re-compilation in Next.js (Hot Reload)
export default mongoose.models.TrackLog || mongoose.model("TrackLog", TrackLogSchema);
