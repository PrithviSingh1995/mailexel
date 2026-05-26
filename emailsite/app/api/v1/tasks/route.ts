import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkApiKey } from "@/lib/server/api-key-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/tasks
 * Query params:
 *   status = pending | done | in_progress | all  (default: all)
 */
export async function GET(req: Request) {
  const auth = checkApiKey(req);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "all";

  try {
    const tasks = await prisma.blogTask.findMany({
      where: status !== "all" ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: { assignedAuthor: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ success: true, data: tasks, count: tasks.length });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

/**
 * POST /api/v1/tasks
 * Body: { "title": string }
 * Creates a new task with status "pending".
 */
export async function POST(req: Request) {
  const auth = checkApiKey(req);
  if (!auth.ok) return auth.response;

  try {
    const { title } = await req.json();
    if (!title?.trim())
      return NextResponse.json({ success: false, message: "title is required" }, { status: 400 });

    const task = await prisma.blogTask.create({
      data: { title: title.trim() },
      include: { assignedAuthor: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
