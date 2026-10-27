import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth/tokens";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("refresh_token")?.value;

  if (token) {
    await prisma.refreshToken.updateMany({
      where: {
        tokenHash: hashToken(token),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}