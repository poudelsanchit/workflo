// app/api/page/route.ts

import {  NextResponse } from "next/server";
import dbConnect from "@/lib/db"; // Your database connection logic
import UserModel from "@/models/user"; // Import UserModel
import { PrivatePageModel } from "@/models/privatepage";
s
// Handle POST requests (creating a new page)
export async function POST(req: Request) {
  await dbConnect(); // Ensure DB connection

  try {
    const { userId, title } = await req.json(); // Extract userId and title from the request body

    // Validate input
    if (!userId || !title) {
      return NextResponse.json(
        { error: "UserId and title are required" },
        { status: 400 }
      );
    }

    // Check if the user exists in the database
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new page in the PrivatePageModel
    const newPage = await PrivatePageModel.create({ title });

    user.pages.private.push({ pageId: newPage._id, title: newPage.title });
    await user.save();

    // Return the success response with the newly created page and updated user
    return NextResponse.json(
      {
        message: "Private page created and added to user",
        newPage,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
