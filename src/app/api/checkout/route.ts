import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/order';
import { Product } from '@/models/product';
import { Settings } from '@/models/settings';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();

    // Get shipping cost from settings
    const settings = await Settings.findOne();
    const shippingCost = settings?.shippingCharge || 0;

    // Calculate total including shipping
    const total = data.products.reduce((sum: number, item: {price: number, quantity: number}) => sum + (item.price * item.quantity), 0) + shippingCost;

    // Create order
    const order = await Order.create({
      ...data,
      total,
      shippingCost,
      status: 'pending'
    });

    // Update product stock
    for (const item of data.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error in checkout:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
} 