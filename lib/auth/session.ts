import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth/tokens";
import type { SessionUser } from "@/types/auth.type";

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await verifyAccessToken(token);

    if (!payload.sub) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};