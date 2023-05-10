import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// prettier-ignore
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
