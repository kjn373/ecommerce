import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the auth cookie by setting it to expire
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("auth-token", "", {
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
