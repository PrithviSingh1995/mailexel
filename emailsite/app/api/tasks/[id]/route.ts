import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await getAuthUser(req);
  if (error) return error;

  try {
    const { id } = await params;
    const { status } = await req.json();
    const task = await prisma.blogTask.update({ where: { id }, data: { status } });
    return NextResponse.json({ success: true, data: task });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await getAuthUser(req);
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.blogTask.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete task" }, { status: 500 });
  }
}
