import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Settings } from "@/models/settings";

export async function GET() {
  try {
    await connectToDatabase();
    const settings = (await Settings.findOne()) || { shippingCharge: 0 };
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();

    const settings = await Settings.findOneAndUpdate(
      {},
      { shippingCharge: data.shippingCharge },
      { upsert: true, new: true },
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
