// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/management/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      if (pathname === "/management/login") {
        return true;
      }

      const isProtectedRoute =
        pathname.startsWith("/admin") || pathname.startsWith("/store");

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.storeId = user.storeId;
        token.accessToken = user.access_token;
        token.refreshToken = user.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.type = token.type as string;
        session.user.storeId = token.storeId as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  providers: [], // Empty for now, added in auth.ts
} satisfies NextAuthConfig;
