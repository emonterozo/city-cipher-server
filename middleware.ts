import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const authHeader = req.headers.get("authorization");
    const username = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASS;

    if (!authHeader?.startsWith("Basic ")) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
      });
    }

    const base64 = authHeader.split(" ")[1];
    const decoded = atob(base64);
    const [user, pass] = decoded.split(":");

    if (user !== username || pass !== password) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
      });
    }
  }

  if (pathname.startsWith("/api")) {
    const apiKey = req.headers.get("x-api-key");
    const validKey = process.env.API_KEY;

    if (!apiKey || apiKey !== validKey) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
