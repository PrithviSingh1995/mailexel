import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getAuthUser(req);
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const review = await prisma.review.update({ where: { id }, data: body });
  revalidatePath("/");
  revalidatePath("/reviews");
  return NextResponse.json({ success: true, data: review });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getAuthUser(req);
  if (error) return error;

  const { id } = await params;
  await prisma.review.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/reviews");
  return NextResponse.json({ success: true });
}
