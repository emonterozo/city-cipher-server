// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // 2. API Key Protection
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.API_KEY) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 3. Protection Logic
  const isProtectedRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/store");
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/management/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
