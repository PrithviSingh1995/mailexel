import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.blog.findMany({ where: { status: "published" }, select: { category: true }, distinct: ["category"] });
    return NextResponse.json({ success: true, data: rows.map((r) => r.category).filter(Boolean) });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
