import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";

export async function POST(req: Request) {
  const { error } = await getAuthUser(req);
  if (error) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const existing = await prisma.ratingVote.count();
  if (existing >= 1842) {
    return NextResponse.json({ success: true, message: `Already have ${existing} votes. No seed needed.`, count: existing });
  }

  const toAdd = 1842 - existing;
  // 1576×5 + 200×4 + 50×3 + 10×2 + 6×1 = 8856/1842 ≈ 4.81 avg
  const distribution = [
    { rating: 5, count: 1576 },
    { rating: 4, count: 200 },
    { rating: 3, count: 50 },
    { rating: 2, count: 10 },
    { rating: 1, count: 6 },
  ];
  const votes = distribution
    .flatMap(({ rating, count }) => Array.from({ length: count }, () => ({ rating })))
    .slice(0, toAdd);

  await prisma.ratingVote.createMany({ data: votes });

  return NextResponse.json({
    success: true,
    message: `Seeded ${votes.length} rating votes.`,
    count: existing + votes.length,
  });
}
