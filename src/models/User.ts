import { Schema, model, models, type InferSchemaType } from "mongoose";

export type UserRole = "admin" | "editor" | "customer";

const userSchema = new Schema(
  {
    name: { type: String, trim: true, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "editor", "customer"],
      default: "customer",
    },
    isTwoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: null },
    refreshTokenHash: { type: String, default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Schema.Types.ObjectId };
export const User = (models && models.User) || model("User", userSchema);
