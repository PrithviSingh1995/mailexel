import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/lib/models/User";

export async function getAuthUser(
  request: Request
): Promise<{ user: IUser | null; error: NextResponse | null }> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, error: NextResponse.json({ success: false, message: "Not authorized — no token" }, { status: 401 }) };
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) return { user: null, error: NextResponse.json({ success: false, message: "User not found" }, { status: 401 }) };
    return { user, error: null };
  } catch {
    return { user: null, error: NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 }) };
  }
}

export function signToken(id: string) {
  const expiresIn = parseInt(process.env.JWT_EXPIRES_SECONDS || "") || 7 * 24 * 60 * 60;
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn });
}
