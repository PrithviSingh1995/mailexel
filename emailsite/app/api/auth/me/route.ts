import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  return NextResponse.json({ success: true, user: { ...user!, _id: user!.id } });
}

export async function PUT(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { name, bio, avatar } = await request.json();
    const updated = await prisma.user.update({
      where: { id: user!.id },
      data: { ...(name && { name }), ...(bio !== undefined && { bio }), ...(avatar !== undefined && { avatar }) },
      select: { id: true, name: true, email: true, role: true, avatar: true, bio: true },
    });
    return NextResponse.json({ success: true, user: { ...updated, _id: updated.id } });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
