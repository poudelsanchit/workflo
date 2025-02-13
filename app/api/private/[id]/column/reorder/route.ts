import dbConnect from "@/lib/db";
import { PrivatePageModel } from "@/models/privatepage";
import { NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  await dbConnect(); // Ensure DB connection

  try {
    const pageId = params.id;
    const { reorderedColumns } = await req.json();

    // Validate input
    if (!Array.isArray(reorderedColumns)) {
      return NextResponse.json({
        error: "Invalid column order format",
        status: 400,
      });
    }

    // Update the column order in the database
    const updatedPage = await PrivatePageModel.findByIdAndUpdate(
      pageId,
      { $set: { column: reorderedColumns } }, // Replace column array
      { new: true } // Return updated document
    );
    if (!updatedPage) {
      return NextResponse.json({ error: "Page not found", status: 404 });
    }

    return NextResponse.json({
      message: "Columns reordered successfully",
      status: 200,
      page: updatedPage,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}
