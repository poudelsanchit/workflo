import dbConnect from "@/lib/db";
import { PrivatePageModel } from "@/models/privatepage";
import { NextResponse } from "next/server";

interface Params {
  id: string;       // Page ID
  columnId: string; // Column ID
}

// Create new task endpoint
export async function POST(req: Request, { params }: { params: Params }) {
  await dbConnect(); // Ensure DB connection

  try {
    const { id: pageId, columnId } = params;
    const { content } = await req.json(); // Extract content for the new task

    // Check if the page exists in the database
    const page = await PrivatePageModel.findById(pageId);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Find the column by columnId
    const column = page.column.find((col) => col.id?.toString() === columnId);
    if (!column) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    // Ensure that tasks is an array, and initialize it if it's undefined
    column.tasks = column.tasks || [];

    // Create a new task object
    const newTask = {
      id: new Date().toISOString(),  // Using ISO date as a simple task ID (can be replaced with UUID or Mongo ObjectId)
      content,                       // Task content from the request body
      columnId,                      // The column to which the task belongs
    };

    // Add the new task to the column's tasks array
    column.tasks.push(newTask);

    // Save the updated page with the new task
    await page.save();

    // Respond with the newly created task details
    return NextResponse.json(
      {
        message: "Task Created Successfully",
        newTask,  // Return the newly created task
        pageId,
        columnId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
