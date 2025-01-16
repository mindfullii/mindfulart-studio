import 'next-auth';
import { User as PrismaUser } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      credits: number;
      isSubscribed: boolean;
    }
  }

  interface User extends PrismaUser {}
} 