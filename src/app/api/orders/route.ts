import { NextRequest, NextResponse } from "next/server";
import { connectToDomainDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

// In-memory fallback order store when MongoDB URI is absent or during offline demo mode
const inMemoryOrders: Array<{
  orderId: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  items: unknown[];
  subtotal: number;
  estimatedTax: number;
  shippingFee: number;
  grandTotal: number;
  status: string;
  createdAt: Date;
}> = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      country = "United States",
      paymentMethod,
      items,
      subtotal,
      estimatedTax,
      shippingFee,
      grandTotal,
      userId,
    } = body;

    if (!fullName || !email || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid order details or cart is empty." } },
        { status: 400 }
      );
    }

    const generatedOrderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderData = {
      orderId: generatedOrderId,
      userId: userId || null,
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      paymentMethod,
      items,
      subtotal: Number(subtotal) || 0,
      estimatedTax: Number(estimatedTax) || 0,
      shippingFee: Number(shippingFee) || 0,
      grandTotal: Number(grandTotal) || 0,
      status: "processing",
      createdAt: new Date(),
    };

    // Try saving to MongoDB if connection is available
    try {
      await connectToDomainDatabase("db_orders");
      const createdOrder = await Order.create(orderData);
      inMemoryOrders.push(orderData);

      return NextResponse.json({
        success: true,
        orderId: createdOrder.orderId,
        order: createdOrder,
        message: "Order placed successfully and saved to database.",
      }, { status: 201 });
    } catch (dbErr) {
      console.warn("MongoDB connection unavailable for orders API, using resilient fallback store:", dbErr);
      inMemoryOrders.push(orderData);

      return NextResponse.json({
        success: true,
        orderId: generatedOrderId,
        order: orderData,
        message: "Order recorded successfully.",
      }, { status: 201 });
    }
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to process order. Please try again." } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: true, orders: inMemoryOrders });
    }

    const emailLower = email.trim().toLowerCase();
    let combinedOrders: any[] = [];

    try {
      await connectToDomainDatabase("db_orders");
      const dbOrders = await Order.find({ email: { $regex: new RegExp(`^${emailLower}$`, "i") } })
        .sort({ createdAt: -1 })
        .lean();
      combinedOrders = dbOrders || [];
    } catch (err) {
      console.warn("MongoDB fetch error for orders, using memory store:", err);
    }

    const memUserOrders = inMemoryOrders.filter(
      (o) => o.email.trim().toLowerCase() === emailLower
    );

    const existingIds = new Set(combinedOrders.map((o) => o.orderId));
    for (const memOrder of memUserOrders) {
      if (!existingIds.has(memOrder.orderId)) {
        combinedOrders.unshift(memOrder);
      }
    }

    return NextResponse.json({ success: true, orders: combinedOrders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ success: false, orders: [] }, { status: 500 });
  }
}
