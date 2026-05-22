import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";

export async function DELETE(request: Request) {
  const { error } = await getAuthUser(request);
  if (error) return error;
  return NextResponse.json(
    { success: false, message: "File storage not available. Use external image URLs." },
    { status: 410 }
  );
}
