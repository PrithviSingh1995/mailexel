import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/server/auth";

async function seedAdmin() {
  const exists = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!exists) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@Mailexel2026", 12);
    await prisma.user.create({
      data: { name: "Admin", email: process.env.ADMIN_EMAIL || "admin@mailexel.com", password: hash, role: "admin" },
    }).catch((e: { code?: string }) => { if (e.code !== "P2002") throw e; });
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password)
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });

    await seedAdmin();
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });

    const { password: _, ...safeUser } = user;
    const token = signToken(user.id);
    return NextResponse.json({ success: true, token, user: { ...safeUser, _id: user.id } });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
