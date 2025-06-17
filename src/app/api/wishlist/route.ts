import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

// Define WishlistItem Schema
const wishlistItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
});

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
});

// Create models
const WishlistItem =
  mongoose.models.WishlistItem ||
  mongoose.model("WishlistItem", wishlistItemSchema);
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();

    const wishlistItems = await WishlistItem.find({
      userId: session.user.email,
    }).populate("productId");

    const formattedItems = wishlistItems.map((item) => ({
      _id: item.productId._id.toString(),
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.images[0],
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { productId } = await req.json();

    await connectToDatabase();

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Check if already in wishlist
    const existingItem = await WishlistItem.findOne({
      userId: session.user.email,
      productId,
    });

    if (existingItem) {
      return new NextResponse("Item already in wishlist", { status: 400 });
    }

    // Add to wishlist
    await WishlistItem.create({
      userId: session.user.email,
      productId,
    });

    return new NextResponse("Added to wishlist", { status: 200 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { productId } = await req.json();

    await connectToDatabase();

    // Remove from wishlist
    await WishlistItem.deleteOne({
      userId: session.user.email,
      productId,
    });

    return new NextResponse("Removed from wishlist", { status: 200 });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
