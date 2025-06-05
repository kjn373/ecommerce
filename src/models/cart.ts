import { model, models, Schema, Types } from "mongoose";

export interface ICart {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
    name: string;
    images: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    images: [{ type: String }]
  }],
}, {
  timestamps: true
});

export const Cart = models?.Cart || model<ICart>('Cart', CartSchema); 