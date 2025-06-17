import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/product";
import Fuse from "fuse.js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    await connectToDatabase();

    // Search in both name and description fields
    // const products = await Product.find({
    //   $or: [
    //     { name: { $regex: query, $options: "i" } },
    //     { description: { $regex: query, $options: "i" } },
    //   ],
    // }).populate("category");
    const products = await Product.find().populate("category");
    const options = {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'description', weight: 0.3 }
      ], //field to search
      threshold: 0.4, //lower means stricter matching
      distance: 100
    }
    const fuse = new Fuse(products, options);

    function SearchProduct(query: string){
      return fuse.search(query).map(result => result.item);
    }

    return NextResponse.json(SearchProduct(query));
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}
