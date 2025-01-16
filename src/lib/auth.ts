import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const handler = NextAuth(authConfig);

export { handler as auth };
export const { GET, POST } = handler;