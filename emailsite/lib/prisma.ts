import { PrismaClient } from "@prisma/client";

const g = globalThis as { _prisma?: PrismaClient };
export const prisma = g._prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g._prisma = prisma;
export default prisma;
