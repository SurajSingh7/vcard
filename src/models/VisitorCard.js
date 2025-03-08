import mongoose from "mongoose";

const VisitorCardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sedulertime: { type: Date, required: true },
    contactNumber: { type: String},
    note: { type: String },
    assignTo: { type: String, required: true },
    visitorCardFront: { type: String },
    visitorCardBack: { type: String },
    whatsapp: { type: Boolean, default: false },
    pin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.VisitorCard || mongoose.model("VisitorCard", VisitorCardSchema);
