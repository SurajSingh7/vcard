import mongoose from "mongoose";

const VisitorCardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sedulertime: { type: Date },
    contactNumber: { type: String },
    qrmobile: { type: String },
    note: { type: String },
    assignTo: { type: String, required: true },
    visitorCardFront: { type: String },
    visitorCardBack: { type: String },
    whatsapp: { type: Boolean, default: false },
    pin: { type: Boolean, default: false },
    track: { type: Number, default: 0 } // Added track field as integer type with initial value 0.
  },
  { timestamps: true }
);

export default mongoose.models.VisitorCard || mongoose.model("VisitorCard", VisitorCardSchema);
