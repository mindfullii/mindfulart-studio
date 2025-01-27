import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined;
}

type PrismaClientSingleton = PrismaClient;

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query'],
  }) as PrismaClientSingleton;
};

type GlobalWithPrisma = typeof globalThis & {
  prisma: PrismaClientSingleton | undefined;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 