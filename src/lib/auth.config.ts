import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
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
    signIn: '/login',
    error: '/login',
  },
  events: {
    async createUser({ user }) {
      // 更新用户的初始积分
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: 10 },
      });

      // 添加积分历史记录
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
        // 获取用户的最新信息
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            credits: true,
            isSubscribed: true,
            name: true,
            email: true,
            image: true,
          },
        });
        
        if (dbUser) {
          session.user.credits = dbUser.credits;
          session.user.isSubscribed = dbUser.isSubscribed;
          session.user.name = dbUser.name;
          session.user.email = dbUser.email;
          session.user.image = dbUser.image;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 如果URL是相对路径，添加baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // 如果URL已经是完整的URL，并且是同一个域名，直接返回
      else if (url.startsWith(baseUrl)) {
        return url;
      }
      // 默认重定向到首页
      return baseUrl;
    },
  },
}; 