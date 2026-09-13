import { Schema, model, models, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true, maxlength: 140 },
    categorySlug: { type: String, required: true, trim: true, lowercase: true, index: true },
    subCategory: { type: String, default: "General", trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    rating: { type: Number, required: true, min: 0, max: 5, default: 4.5 },
    description: { type: String, default: "", trim: true },
    inStock: { type: Boolean, default: true },
    badge: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export type ProductDocument = InferSchemaType<typeof productSchema>;
export const Product = (models && models.Product) || model("Product", productSchema);
