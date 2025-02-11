import dbConnect from "@/lib/db";
import { PrivatePageModel } from "@/models/privatepage";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
interface Params {
  id: string;
}
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  dbConnect();
  try {
    const pageId = params.id;
    const data = await PrivatePageModel.findById(pageId);
    if (!data) {
      return NextResponse.json({
        message: "Enter valid pageId",
        success: true,
        status: 200,
        data,
      });
    }
    return NextResponse.json({
      message: "message",
      success: true,
      status: 200,
      data,
    });
  } catch (error) {
    return NextResponse.json("Internal server error");
  }
}

// Delete page or space functionality
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  dbConnect();
  try {
    const { userId } = await request.json(); // Extract userId and title from the request body
    const spaceId = params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const pageIndexInUserModel = await user.pages.private.findIndex(
      (space: any) => space.pageId.toString() === spaceId
    );
    if (pageIndexInUserModel === -1) {
      return NextResponse.json({
        message: "Column not found",
        status: 404,
      });
    }
    const deletedSpace = user.pages.private.splice(pageIndexInUserModel, 1);
    await user.save();

    const page = await PrivatePageModel.findByIdAndDelete(spaceId);
    if (!page) {
      // Return 404 if space not found
      return NextResponse.json(
        { message: "Space not found", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Space Deleted Sucessfully",
      user,
      deletedSpace,
      success: true,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json("Error deleting the space");
  }
}
