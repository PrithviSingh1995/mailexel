import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthUser } from "@/lib/server/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword)
      return NextResponse.json({ success: false, message: "Both current and new password are required" }, { status: 400 });
    if (newPassword.length < 8)
      return NextResponse.json({ success: false, message: "New password must be at least 8 characters" }, { status: 400 });

    const fullUser = await prisma.user.findUnique({ where: { id: user!.id } });
    if (!fullUser || !(await bcrypt.compare(currentPassword, fullUser.password)))
      return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 401 });

    const hash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user!.id }, data: { password: hash } });
    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
