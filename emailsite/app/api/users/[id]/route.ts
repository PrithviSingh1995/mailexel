import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";

const safeSelect = {
  id: true, name: true, email: true, role: true,
  avatar: true, bio: true, createdAt: true, updatedAt: true,
  _count: { select: { blogs: true, assignedTasks: true } },
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getAuthUser(req);
  if (error) return error;
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id }, select: safeSelect });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: authUser, error } = await getAuthUser(req);
  if (error) return error;
  if (authUser!.role !== "admin")
    return NextResponse.json({ success: false, message: "Only admins can edit users" }, { status: 403 });

  try {
    const { id } = await params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const { name, email, role, avatar, bio, password } = await req.json();

    if (email && email.toLowerCase() !== existing.email) {
      const conflict = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (conflict)
        return NextResponse.json({ success: false, message: "Email already in use" }, { status: 409 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name.trim();
    if (email !== undefined) data.email = email.toLowerCase();
    if (role !== undefined) data.role = role;
    if (avatar !== undefined) data.avatar = avatar;
    if (bio !== undefined) data.bio = bio;
    if (password) {
      if (password.length < 8)
        return NextResponse.json({ success: false, message: "Password must be at least 8 characters" }, { status: 400 });
      data.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({ where: { id }, data, select: safeSelect });
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: authUser, error } = await getAuthUser(req);
  if (error) return error;
  if (authUser!.role !== "admin")
    return NextResponse.json({ success: false, message: "Only admins can delete users" }, { status: 403 });

  try {
    const { id } = await params;
    if (id === authUser!.id)
      return NextResponse.json({ success: false, message: "You cannot delete your own account" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
