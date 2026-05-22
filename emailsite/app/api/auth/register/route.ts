import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/server/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password)
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 });
    if (password.length < 8)
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing)
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 });

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email: email.toLowerCase(), password: hash, role: role || "editor" } });
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, token: signToken(user.id), user: { ...safeUser, _id: user.id } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
