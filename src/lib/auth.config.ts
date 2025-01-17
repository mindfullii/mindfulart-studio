import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  events: {
    async createUser({ user }) {
      // 当用户创建时添加积分历史记录
      await prisma.creditHistory.create({
        data: {
          userId: user.id,
          amount: 10,
          type: 'welcome',
          description: 'Welcome bonus credits',
        },
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            credits: true,
            isSubscribed: true,
          },
        });
        session.user.credits = dbUser?.credits || 0;
        session.user.isSubscribed = dbUser?.isSubscribed || false;
      }
      return session;
    },
  },
}; 