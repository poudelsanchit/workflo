import dbConnect from "@/lib/db";
import { PrivatePageModel } from "@/models/privatepage";
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
    return NextResponse.json({
      message: "message",
      success: true,
      status: 200,
      data,
    });
  } catch (error) {
    return NextResponse.json("message");
  }
}

