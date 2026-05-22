import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  return NextResponse.json({ success: true, user });
}

export async function PUT(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { name, bio, avatar } = await request.json();
    await connectDB();
    const updated = await User.findByIdAndUpdate(
      user!._id,
      { name, bio, avatar },
      { new: true, runValidators: true }
    );
    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
