import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { verifyPassword } from "@/lib/auth/passwords";
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
} from "@/lib/auth/tokens";
import { apiError } from "@/lib/http/api-response";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Datos inválidos");
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user || !(await verifyPassword(
    parsed.data.password,
    user.passwordHash
  ))) {
    return apiError(401, "INVALID_CREDENTIALS", "Credenciales incorrectas");
  }

  const access = await createAccessToken(user.id, user.role);
  const refresh = await createRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refresh),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const response = NextResponse.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  response.cookies.set("access_token", access, {
    ...cookieOptions,
    maxAge: 15 * 60,
  });

  response.cookies.set("refresh_token", refresh, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}