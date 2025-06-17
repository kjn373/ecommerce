import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "user deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
