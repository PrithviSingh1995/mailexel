import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";

export async function POST(request: Request) {
  const { error } = await getAuthUser(request);
  if (error) return error;
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    if (!file) return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });

    if (!/^image\/(jpeg|jpg|png|gif|webp)$/.test(file.type))
      return NextResponse.json({ success: false, message: "Only image files are allowed" }, { status: 400 });
    if (file.size > 2 * 1024 * 1024)
      return NextResponse.json({ success: false, message: "File too large (max 2 MB)" }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const url = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;
    return NextResponse.json({ success: true, url, filename: file.name });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
