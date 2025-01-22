import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AdapterUser } from "@auth/core/adapters";
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
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Check if there's a returnUrl in the URL
      try {
        const parsedUrl = new URL(url);
        const returnUrl = parsedUrl.searchParams.get('returnUrl');
        if (returnUrl) {
          // Make sure the returnUrl is safe (starts with a slash and is a relative path)
          if (returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
            return `${baseUrl}${returnUrl}`;
          }
        }
      } catch (error) {
        console.error('Error parsing URL:', error);
      }

      // If no valid returnUrl is found, handle the URL directly
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default fallback
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
    async createUser({ user }: { user: AdapterUser }) {
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