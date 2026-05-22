import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const onlyPublished = searchParams.get("published") === "true";

  const reviews = await prisma.review.findMany({
    where: onlyPublished ? { published: true } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data: reviews });
}

export async function POST(req: Request) {
  const { error } = await getAuthUser(req);
  if (error) return error;

  const body = await req.json();
  const review = await prisma.review.create({ data: body });
  revalidatePath("/");
  revalidatePath("/reviews");
  return NextResponse.json({ success: true, data: review }, { status: 201 });
}
