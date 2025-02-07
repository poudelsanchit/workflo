import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { PrivatePageModel } from "@/models/privatepage";
interface Params {
  id: string;
}

export async function POST(req: Request, { params }: { params: Params }) {
  await dbConnect(); // Ensure DB connection

  try {
    const pageId = params.id;
    const { id, title, color } = await req.json(); // Extract userId and title from the request body

    // Check if the user exists in the database
    const page = await PrivatePageModel.findById(pageId);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    const data = { id, title, color };
    page.column.push({ id, title, color });
    await page.save();

    return NextResponse.json(
      {
        message: "Page found successfully",
        data: data,
        page: page,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Column:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
