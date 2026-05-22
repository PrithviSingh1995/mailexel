import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const votes = await prisma.ratingVote.findMany();
  const count = votes.length;
  const avg = count > 0
    ? Math.round((votes.reduce((s, v) => s + v.rating, 0) / count) * 10) / 10
    : 0;
  return NextResponse.json({ success: true, data: { avg, count } });
}

export async function POST(req: Request) {
  const { rating } = await req.json();
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ success: false, message: "Rating must be 1–5" }, { status: 400 });
  }
  await prisma.ratingVote.create({ data: { rating: Number(rating) } });
  const votes = await prisma.ratingVote.findMany();
  const count = votes.length;
  const avg = Math.round((votes.reduce((s, v) => s + v.rating, 0) / count) * 10) / 10;
  return NextResponse.json({ success: true, data: { avg, count } });
}
