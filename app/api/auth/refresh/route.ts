import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "@/lib/auth/tokens";
import { apiError } from "@/lib/http/api-response";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("refresh_token")?.value;

  if (!token) {
    return apiError(401, "UNAUTHENTICATED", "Inicia sesión nuevamente");
  }

  try {
    const { payload } = await verifyRefreshToken(token);

    if (!payload.sub) {
      return apiError(401, "INVALID_TOKEN", "Token inválido");
    }

    const oldToken = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });

    if (
      !oldToken ||
      oldToken.userId !== payload.sub ||
      oldToken.revokedAt ||
      oldToken.expiresAt <= new Date()
    ) {
      return apiError(401, "INVALID_TOKEN", "Sesión revocada o vencida");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true },
    });

    if (!user) {
      return apiError(401, "INVALID_TOKEN", "Usuario inexistente");
    }

    const access = await createAccessToken(user.id, user.role);
    const refresh = await createRefreshToken(user.id);

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: oldToken.id },
        data: { revokedAt: new Date() },
      }),
      prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(refresh),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    const response = NextResponse.json({ success: true });

    const secure = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure,
      sameSite: "lax" as const,
      path: "/",
    };

    response.cookies.set("access_token", access, {
      ...cookieOptions,
      maxAge: 15 * 60,
    });

    response.cookies.set("refresh_token", refresh, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return apiError(401, "INVALID_TOKEN", "Refresh token inválido");
  }
}