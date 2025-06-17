import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({ accountType: "USER" }).sort({
      createdAt: -1,
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Check for existing user with the same username
    const existingUsername = await User.findOne({ username: body.username });
    if (existingUsername) {
      return NextResponse.json(
        { error: "DUPLICATE_USERNAME" },
        { status: 400 },
      );
    }

    // Check for existing user with the same email
    const existingEmail = await User.findOne({ email: body.email });
    if (existingEmail) {
      return NextResponse.json({ error: "DUPLICATE_EMAIL" }, { status: 400 });
    }

    // Create new user if no duplicates found
    const user = await User.create(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
