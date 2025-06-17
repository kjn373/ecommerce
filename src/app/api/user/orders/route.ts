import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/order";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Query orders by userId or email (fallback)
    const query = {
      $or: [
        { userId: session.user.id },
        { email: session.user.email }
      ]
    };
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("products.productId", "name images");

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
