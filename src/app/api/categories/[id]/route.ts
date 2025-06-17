import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/category";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await connectToDatabase();

    // Check if another category with the same name already exists
    const existingCategory = await Category.findOne({
      name: data.name,
      _id: { $ne: id },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 },
      );
    }

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    // You might want to check if category is in use by products before deleting

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
