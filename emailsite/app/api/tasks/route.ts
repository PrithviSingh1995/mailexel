import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";

export async function GET() {
  try {
    const tasks = await prisma.blogTask.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: tasks });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { user, error } = await getAuthUser(req);
  if (error) return error;

  try {
    const { title } = await req.json();
    if (!title?.trim()) return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });

    const task = await prisma.blogTask.create({ data: { title: title.trim() } });
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create task" }, { status: 500 });
  }
}
