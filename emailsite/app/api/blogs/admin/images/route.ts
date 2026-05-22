import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { error } = await getAuthUser(request);
  if (error) return error;
  return NextResponse.json({ success: true, data: [] });
}
