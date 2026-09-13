import { Schema, model, models, type InferSchemaType } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, maxlength: 80 },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true, maxlength: 100 },
    icon: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: "", trim: true },
    itemCount: { type: Number, default: 0 },
    badge: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;
export const Category = (models && models.Category) || model("Category", categorySchema);
