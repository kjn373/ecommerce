import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/order";
import "@/models/product"; 

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("products.productId", "name"); // Populate product names

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
