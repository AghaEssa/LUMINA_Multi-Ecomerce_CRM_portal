import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory fallback order store for resilient fallback during offline demo mode
const inMemoryOrders: any[] = [];

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

    const orderPayload = {
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
      subtotal: Number(subtotal) || 0,
      estimatedTax: Number(estimatedTax) || 0,
      shippingFee: Number(shippingFee) || 0,
      grandTotal: Number(grandTotal) || 0,
      status: "processing",
    };

    // Try saving to Neon PostgreSQL via Prisma
    try {
      const createdOrder = await prisma.order.create({
        data: {
          ...orderPayload,
          items: {
            create: items.map((item: any) => ({
              title: item.title || "Product Item",
              price: Number(item.price) || 0,
              quantity: Number(item.quantity) || 1,
              image: item.image || "",
              size: item.size || null,
              productId: item.productId || null,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      inMemoryOrders.push(createdOrder);

      return NextResponse.json({
        success: true,
        orderId: createdOrder.orderId,
        order: createdOrder,
        message: "Order placed successfully and saved to PostgreSQL database.",
      }, { status: 201 });
    } catch (dbErr) {
      console.warn("PostgreSQL connection notice for orders API, using fallback store:", dbErr);
      const fallbackOrder = {
        ...orderPayload,
        items,
        createdAt: new Date(),
      };
      inMemoryOrders.push(fallbackOrder);

      return NextResponse.json({
        success: true,
        orderId: generatedOrderId,
        order: fallbackOrder,
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
      let allOrders: any[] = [];
      try {
        allOrders = await prisma.order.findMany({
          include: { items: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        });
      } catch {
        allOrders = inMemoryOrders;
      }
      return NextResponse.json({ success: true, orders: allOrders });
    }

    const emailLower = email.trim().toLowerCase();
    let dbOrders: any[] = [];

    try {
      dbOrders = await prisma.order.findMany({
        where: {
          email: { equals: emailLower, mode: "insensitive" },
        },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      console.warn("PostgreSQL fetch error for orders, using memory store:", err);
    }

    const memUserOrders = inMemoryOrders.filter(
      (o) => o.email?.trim().toLowerCase() === emailLower
    );

    const existingIds = new Set(dbOrders.map((o) => o.orderId));
    for (const memOrder of memUserOrders) {
      if (!existingIds.has(memOrder.orderId)) {
        dbOrders.unshift(memOrder);
      }
    }

    return NextResponse.json({ success: true, orders: dbOrders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ success: false, orders: [] }, { status: 500 });
  }
}
