import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import User from "@/lib/models/User";

export async function PUT(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword)
      return NextResponse.json({ success: false, message: "Both current and new password are required" }, { status: 400 });
    if (newPassword.length < 8)
      return NextResponse.json({ success: false, message: "New password must be at least 8 characters" }, { status: 400 });

    const fullUser = await User.findById(user!._id).select("+password");
    if (!fullUser || !(await fullUser.comparePassword(currentPassword)))
      return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 401 });

    fullUser.password = newPassword;
    await fullUser.save();
    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
