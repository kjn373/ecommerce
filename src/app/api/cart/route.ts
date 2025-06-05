import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Cart } from '@/models/cart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await connectToDatabase();

    if (session?.user?.id) {
      // Get user's cart from database
      let cart = await Cart.findOne({ userId: session.user.id });
      if (!cart) {
        cart = await Cart.create({ userId: session.user.id, items: [] });
      }
      return NextResponse.json(cart);
    } else {
      // Return empty cart for guest users
      return NextResponse.json({ items: [] });
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// Update cart
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();
    await connectToDatabase();

    if (session?.user?.id) {
      // Map the items to the format expected by the database model if necessary
      const cartItems = Array.isArray(data.items) ? data.items : [];
      
      // Update user's cart in database
      const cart = await Cart.findOneAndUpdate(
        { userId: session.user.id },
        { items: cartItems },
        { new: true, upsert: true }
      );
      return NextResponse.json(cart);
    } else {
      // For guest users, just return the updated cart data
      return NextResponse.json({ items: data.items || [] });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// Clear cart
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    await connectToDatabase();

    if (session?.user?.id) {
      // Clear user's cart in database
      await Cart.findOneAndUpdate(
        { userId: session.user.id },
        { items: [] }
      );
    }
    
    return NextResponse.json({ items: [] });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
} 