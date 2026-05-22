import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";
import { defaultHomeContent, defaultGlobalContent } from "@/lib/types/page-content";
import { revalidatePath } from "next/cache";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const record = await prisma.pageContent.findUnique({ where: { slug } });
  const defaults = slug === "home" ? defaultHomeContent : slug === "global" ? defaultGlobalContent : {};
  return NextResponse.json({
    success: true,
    data: record ? { ...defaults, ...(record.content as object) } : defaults,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  if (user!.role !== "admin")
    return NextResponse.json({ success: false, message: "Admin only" }, { status: 403 });

  const { slug } = await params;
  const body = await request.json();

  const record = await prisma.pageContent.upsert({
    where: { slug },
    update: { content: body },
    create: { slug, content: body },
  });

  revalidatePath("/");
  return NextResponse.json({ success: true, data: record.content });
}
