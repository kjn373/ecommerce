import { model, models, Schema, Types } from "mongoose";

export interface IOrder {
  _id: Types.ObjectId;
  userId: string;
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  products: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingCost: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Delete the model if it exists to prevent using the cached version
if (models.Order) {
  delete models.Order;
}

export const Order = model<IOrder>("Order", OrderSchema);
