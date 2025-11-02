import mongoose, { type Document, type Model, Schema } from "mongoose";
import type { SubscriptionTier } from "@/types";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  subscriptionTier: SubscriptionTier;
  searchesUsed: number;
  searchesResetAt: Date;
  paypalSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    subscriptionTier: {
      type: String,
      enum: ["FREE", "MONTHLY", "YEARLY", "ONE_OFF"],
      default: "FREE",
    },
    searchesUsed: {
      type: Number,
      default: 0,
    },
    searchesResetAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    paypalSubscriptionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  (mongoose.models && mongoose.models.User) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
