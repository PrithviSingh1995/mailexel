import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const onlyPublished = searchParams.get("published") === "true";

  const reviews = await prisma.review.findMany({
    where: onlyPublished ? { published: true } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data: reviews });
}

export async function POST(req: Request) {
  const body = await req.json();

  // Check if this is an admin creating a review (has valid token)
  const { error } = await getAuthUser(req);
  const isAdmin = !error;

  // Public submissions are always unpublished and never shown on home
  const data = isAdmin
    ? body
    : {
        authorName: body.authorName?.trim() ?? "",
        authorRole: body.authorRole?.trim() ?? "",
        authorImage: "",
        rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
        content: body.content?.trim() ?? "",
        tag: "",
        tagDark: false,
        published: false,
        showOnHome: false,
      };

  if (!data.authorName || !data.content) {
    return NextResponse.json({ success: false, message: "Name and review are required" }, { status: 400 });
  }

  const review = await prisma.review.create({ data });

  if (isAdmin) {
    revalidatePath("/");
    revalidatePath("/reviews");
  }

  return NextResponse.json({ success: true, data: review }, { status: 201 });
}
