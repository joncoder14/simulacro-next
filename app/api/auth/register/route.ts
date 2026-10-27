import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas/auth.schema";
import { hashPassword } from "@/lib/auth/passwords";
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
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Datos inválidos");
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return apiError(409, "EMAIL_EXISTS", "El correo ya está registrado");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
    },
    select: { id: true, name: true, email: true, role: true },
  });

  const access = await createAccessToken(user.id, user.role);
  const refresh = await createRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refresh),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const response = NextResponse.json({ success: true, data: user }, {
    status: 201,
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