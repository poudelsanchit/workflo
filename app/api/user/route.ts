import dbConnect from "@/lib/db";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect(); // Ensure database connection

  try {
    const userId = request.nextUrl.searchParams.get("userId"); // Get userId from query params

    if (!userId) {
      return NextResponse.json({ message: "UserId is required" }, { status: 400 });
    }

    const user = await UserModel.findById(userId); // Query user by ID

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User data fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}
