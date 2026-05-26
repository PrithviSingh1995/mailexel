import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";

const safeSelect = {
  id: true, name: true, email: true, role: true,
  avatar: true, bio: true, linkedin: true, longBio: true,
  createdAt: true, updatedAt: true,
  _count: { select: { blogs: true, assignedTasks: true } },
};

export async function GET(req: Request) {
  const { error } = await getAuthUser(req);
  if (error) return error;
  try {
    const users = await prisma.user.findMany({ select: safeSelect, orderBy: { createdAt: "asc" } });
    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { user: authUser, error } = await getAuthUser(req);
  if (error) return error;
  if (authUser!.role !== "admin")
    return NextResponse.json({ success: false, message: "Only admins can create users" }, { status: 403 });

  try {
    const { name, email, password, role = "editor", avatar = "", bio = "", linkedin = "", longBio = "" } = await req.json();
    if (!name?.trim() || !email?.trim() || !password)
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 });
    if (password.length < 8)
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing)
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 });

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name: name.trim(), email: email.toLowerCase(), password: hash, role, avatar, bio, linkedin, longBio },
      select: safeSelect,
    });
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
