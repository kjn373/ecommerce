import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    shippingCharge: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Settings =
  mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
