import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkApiKey } from "@/lib/server/api-key-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/tasks/:id
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = checkApiKey(req);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const task = await prisma.blogTask.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: task });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

/**
 * PATCH /api/v1/tasks/:id
 * Body: { "status": "pending" | "in_progress" | "done" }
 * Updates the task status.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = checkApiKey(req);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, title } = body;

    const existing = await prisma.blogTask.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });

    const task = await prisma.blogTask.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(title !== undefined && { title: title.trim() }),
      },
    });
    return NextResponse.json({ success: true, data: task });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/tasks/:id
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = checkApiKey(req);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const existing = await prisma.blogTask.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    await prisma.blogTask.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Task deleted" });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
