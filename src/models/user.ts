import mongoose from "mongoose";
import bcrypt from "bcrypt";

export type IUser = {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  accountType: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    accountType: { type: String, required: true, default: "USER" },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error hashing password:", errorMessage);
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
