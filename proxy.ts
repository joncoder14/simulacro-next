import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/tokens";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }

  const isPrivate = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  if (!isPrivate && !isAdmin) return NextResponse.next();

  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await verifyAccessToken(token);

    if (!payload.sub) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAdmin && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};