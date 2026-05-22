import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.ratingVote.count();
  if (existing >= 1842) {
    console.log(`Already have ${existing} votes. Skipping seed.`);
    return;
  }
  const toAdd = 1842 - existing;
  // 1576×5 + 200×4 + 50×3 + 10×2 + 6×1 = 8856 points / 1842 = 4.808 avg
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
  console.log(`Seeded ${votes.length} rating votes. Total: ${existing + votes.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
