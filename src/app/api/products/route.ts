import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/product";
import "@/models/category"; // Import for side effects to ensure Category model is loaded

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Get URL and search params
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "-createdAt"; // Default sort by newest
    const limit = parseInt(searchParams.get("limit") || "0"); // 0 means no limit
    const category = searchParams.get("category");

    // Build query
    const query: { category?: string } = {};
    if (category) {
      query.category = category;
    }

    // Build sort object
    const sortObj: { [key: string]: 1 | -1 } = {};
    if (sort.startsWith("-")) {
      sortObj[sort.substring(1)] = -1; // Descending
    } else {
      sortObj[sort] = 1; // Ascending
    }

    // Execute query with options
    const products = await Product.find(query)
      .sort(sortObj)
      .limit(limit)
      .populate("category", "name");

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();

    const product = await Product.create(data);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
