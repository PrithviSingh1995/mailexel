import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { signToken } from "@/lib/server/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password)
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });

    const token = signToken(String(user._id));
    return NextResponse.json({ success: true, token, user });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
