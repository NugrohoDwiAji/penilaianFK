import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from "@prisma/client";

// Singleton pattern untuk development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (typeof window === 'undefined') {
  // Hanya inisialisasi di server-side
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5
  });

  prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
} else {
  // Di client-side, buat instance kosong atau throw error
  prisma = {} as PrismaClient;
}

export { prisma };