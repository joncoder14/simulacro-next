import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { spaceSchema } from "@/lib/schemas/space.schema";
import {
  createSpace,
  listSpaces,
} from "@/lib/services/spaces.service";
import { apiError, apiSuccess } from "@/lib/http/api-response";

export async function GET() {
  return apiSuccess(await listSpaces());
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) return apiError(401, "UNAUTHENTICATED", "Inicia sesión");
  if (user.role !== "ADMIN") {
    return apiError(403, "FORBIDDEN", "Solo administradores");
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = spaceSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Datos inválidos");
  }

  return apiSuccess(await createSpace(parsed.data), 201);
}