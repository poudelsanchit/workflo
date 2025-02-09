import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { PrivatePageModel } from "@/models/privatepage";
interface Params {
  id: string;
}

//Create new column endpoint
export async function POST(req: Request, { params }: { params: Params }) {
  await dbConnect(); // Ensure DB connection

  try {
    const pageId = params.id;
    const { id, title, color, tasks } = await req.json(); // Extract userId and title from the request body

    // Check if the user exists in the database
    const page = await PrivatePageModel.findById(pageId);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    const column = { id, title, color, tasks: tasks || [] };
    page.column.push(column);
    await page.save();

    // Retrieve the newly added column with its _id
    const addedColumn = page.column[page.column.length - 1]; // Get the last added column

    return NextResponse.json(
      {
        message: "Column Created Succesfully",
        newColumn: addedColumn,
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

export async function PATCH(req: Request, { params }: { params: Params }) {
  await dbConnect(); // Ensure DB connection

  try {
    const pageId = params.id;
    const { title, columnId } = await req.json(); // Extract userId and title from the request body

    const page = await PrivatePageModel.findById(pageId);
    if (!page) {
      return NextResponse.json({
        message: "Page not found",
        status: 404,
      });
    }
    // Find the column to update
    const column = page.column.find((col) => col.id?.toString() === columnId);
    console.log(column);
    if (!column) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }
    column.title = title;
    await page.save();

    return NextResponse.json({
      message: "Column title updated successfully",
      page,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request, { params }: { params: Params }) {
  await dbConnect();
  try {
    const pageId = params.id;
    const { columnId } = await req.json();
    const page = await PrivatePageModel.findById(pageId);
    if (!page) {
      return NextResponse.json({
        message: "Page not found",
        status: 404,
      });
    }
    // Find the column index to delete
    const columnIndex = page.column.findIndex(
      (col) => col.id?.toString() === columnId
    );
    if (columnIndex === -1) {
      return NextResponse.json({
        message: "Column not found",
        status: 404,
      });
    }
    const deletedColumn = page.column.splice(columnIndex, 1);

    await page.save();

    return NextResponse.json({
      message: "Column Deleted Successfully",
      column: deletedColumn,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
