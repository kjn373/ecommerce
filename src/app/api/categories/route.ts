import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Category } from '@/models/category';
import { SortOrder } from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Get URL and search params
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'name'; // Default sort by name
    
    // Build sort object
    const sortObj: { [key: string]: SortOrder } = {};
    if (sort.startsWith('-')) {
      sortObj[sort.substring(1)] = -1; // Descending
    } else {
      sortObj[sort] = 1; // Ascending
    }

    // Execute query with options
    const categories = await Category.find().sort(sortObj);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();
    
    // Check if category with the same name already exists
    const existingCategory = await Category.findOne({ name: data.name });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }
    
    const category = await Category.create(data);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
} 