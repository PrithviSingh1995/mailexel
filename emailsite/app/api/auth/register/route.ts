import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { signToken } from "@/lib/server/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password)
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 });
    if (password.length < 8)
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters" }, { status: 400 });

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 });

    const user = await User.create({ name, email, password, role: role || "editor" });
    const token = signToken(String(user._id));
    return NextResponse.json({ success: true, token, user }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
