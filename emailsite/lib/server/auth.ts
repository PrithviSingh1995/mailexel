import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export type AuthUser = { id: string; name: string; email: string; role: string; avatar: string; bio: string };

export async function getAuthUser(
  request: Request
): Promise<{ user: AuthUser | null; error: NextResponse | null }> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, error: NextResponse.json({ success: false, message: "Not authorized — no token" }, { status: 401 }) };
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true, name: true, email: true, role: true, avatar: true, bio: true } });
    if (!user) return { user: null, error: NextResponse.json({ success: false, message: "User not found" }, { status: 401 }) };
    return { user, error: null };
  } catch {
    return { user: null, error: NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 }) };
  }
}

export function signToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: 7 * 24 * 60 * 60 });
}
