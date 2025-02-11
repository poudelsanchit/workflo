import dbConnect from "@/lib/db";
import { PrivatePageModel } from "@/models/privatepage";
import { NextResponse } from "next/server";

interface Params {
  id: string; // Page ID
  columnId: string; // Column ID
}

// Create new task endpoint
export async function POST(req: Request, { params }: { params: Params }) {
  await dbConnect(); // Ensure DB connection

  try {
    const { id: pageId, columnId } = params;
    const { content, label } = await req.json(); // Extract content for the new task
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

    const taskNumbers = column.tasks
      .filter((task) => task.label === label && task.uniqueId) // Ensure uniqueId exists
      .map((task) => {
        const uniqueIdStr = String(task.uniqueId); // Convert to string safely
        const match = uniqueIdStr.match(new RegExp(`^${label}-(\\d+)$`));
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((num): num is number => num !== null); // Type guard to remove null values

    const nextTaskNumber =
      taskNumbers.length > 0 ? Math.max(...taskNumbers) + 1 : 1;
    const newUniqueId = `${label}-${nextTaskNumber}`; // Generate the next unique ID

    // Create a new task object
    const newTask = {
      id: new Date().toISOString(), // Using ISO date as a simple task ID (can be replaced with UUID or Mongo ObjectId)
      content, // Task content from the request body
      label,
      columnId, // The column to which the task belongs
      uniqueId: newUniqueId,
    };

    // Add the new task to the column's tasks array
    column.tasks.push(newTask);

    // Save the updated page with the new task
    await page.save();

    // Respond with the newly created task details
    return NextResponse.json(
      {
        message: "Task Created Successfully",
        newTask, // Return the newly created task
        pageId,
        columnId,
        label,
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
export async function PUT(req: Request, { params }: { params: Params }) {
  await dbConnect();
  try {
    const { id: pageId, columnId } = params;
    const { content, taskId, label: newLabel } = await req.json(); // Extract new label

    const page = await PrivatePageModel.findById(pageId);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const column = page.column.find((col) => col.id?.toString() === columnId);
    if (!column) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    if (!column.tasks) column.tasks = [];

    // Find the task to update
    const task = column.tasks.find((task) => task.id === taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // If the label is changed, find the next available uniqueId for the new label
    if (task.label !== newLabel) {
      const taskNumbers = column.tasks
        .filter((t) => t.label === newLabel && t.uniqueId) // Find tasks with the same new label
        .map((t) => {
          const uniqueIdStr = String(t.uniqueId);
          const match = uniqueIdStr.match(new RegExp(`^${newLabel}-(\\d+)$`));
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((num): num is number => num !== null);

      const nextTaskNumber =
        taskNumbers.length > 0 ? Math.max(...taskNumbers) + 1 : 1;
      task.uniqueId = `${newLabel}-${nextTaskNumber}`; // Assign new uniqueId in the database
    }

    // Update task properties
    task.content = content;
    task.label = newLabel;

    // Save the updated page
    await page.save();

    return NextResponse.json({
      message: "Task Updated Successfully",
      updatedTask: task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Error updating tasks" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  dbConnect();
  try {
    const { id: pageId, columnId } = params;
    const { taskId } = await req.json(); // Extract new label

    const page = await PrivatePageModel.findById(pageId);
    if (!page) {
      return NextResponse.json({ message: "Page not found", status: 404 });
    }
    const column = page?.column.find((col) => col.id?.toString() === columnId);
    // Ensure that tasks array exists, otherwise initialize it as an empty array
    if (!column) {
      return NextResponse.json({ message: "Column not found", status: 404 });
    }
    column.tasks = column.tasks || [];
    //find task index to delete
    const taskIndex = column?.tasks?.findIndex(
      (task) => task.id.toString() === taskId
    );
    if (taskIndex === -1) {
      return NextResponse.json({
        message: "Column not found",
        status: 404,
      });
    }
    const deletedTask = column?.tasks.splice(taskIndex, 1);
    await page?.save();
    return NextResponse.json({
      message: "Task deleted succcesfully",
      deletedTask,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Error updating tasks" },
      { status: 500 }
    );
  }
}
