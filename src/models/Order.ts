import { Schema, model, models, type InferSchemaType } from "mongoose";

const orderItemSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  size: { type: String },
});

const orderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "United States" },
    paymentMethod: { type: String, required: true, enum: ["card", "paypal", "cod"] },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    estimatedTax: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    status: { type: String, default: "processing", enum: ["processing", "shipped", "delivered", "cancelled"] },
  },
  { timestamps: true }
);

export type OrderDocument = InferSchemaType<typeof orderSchema>;
export const Order = (models && models.Order) || model("Order", orderSchema);
