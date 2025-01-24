import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";

interface ExtendedUser extends User {
  credits: number;
  isSubscribed: boolean;
}

type ExtendedSession = Session & {
  user: {
    id: string;
    credits: number;
    isSubscribed: boolean;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      // 如果是相对路径，添加baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // 如果已经是完整URL，直接返回
      else if (url.startsWith("http")) {
        return url;
      }
      return baseUrl;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.credits = (user as ExtendedUser).credits;
        token.isSubscribed = (user as ExtendedUser).isSubscribed;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          credits: token.credits as number,
          isSubscribed: token.isSubscribed as boolean,
        },
      };
    },
  },
  events: {
    async createUser({ user }) {
      // Give new users 10 free credits
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: 10 },
      });

      // Record the credit history
      await prisma.creditHistory.create({
        data: {
          userId: user.id,
          amount: 10,
          type: "WELCOME",
          description: "Welcome bonus credits",
        },
      });
    },
  },
}; 