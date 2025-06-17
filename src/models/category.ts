import mongoose from "mongoose";

export interface ICategory {
  _id: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
