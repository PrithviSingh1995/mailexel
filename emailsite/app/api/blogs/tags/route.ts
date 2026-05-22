import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.blog.findMany({ where: { status: "published" }, select: { tags: true } });
    const tags = [...new Set(rows.flatMap((r) => r.tags))];
    return NextResponse.json({ success: true, data: tags });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
