import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { spaceSchema } from "@/lib/schemas/space.schema";
import { getSpace, updateSpace, deactivateSpace } from "@/lib/services/spaces.service";
import { apiError, apiSuccess } from "@/lib/http/api-response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  const space = await getSpace(id);

  if (!space) return apiError(404, "NOT_FOUND", "Espacio no encontrado");

  return apiSuccess(space);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const user = await getSessionUser();

  if (!user) return apiError(401, "UNAUTHENTICATED", "Inicia sesión");
  if (user.role !== "ADMIN") {
    return apiError(403, "FORBIDDEN", "Solo administradores");
  }

  const { id } = await context.params;
  const body: unknown = await request.json().catch(() => null);
  const parsed = spaceSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Datos inválidos");
  }

  const existing = await getSpace(id);

  if (!existing) return apiError(404, "NOT_FOUND", "Espacio no encontrado");

  return apiSuccess(await updateSpace(id, parsed.data));
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  const user = await getSessionUser();

  if (!user) return apiError(401, "UNAUTHENTICATED", "Inicia sesión");
  if (user.role !== "ADMIN") {
    return apiError(403, "FORBIDDEN", "Solo administradores");
  }

  const { id } = await context.params;

  try {
    return apiSuccess(await deactivateSpace(id));
  } catch (error) {
    if (error instanceof Error &&
        error.message === "SPACE_HAS_FUTURE_RESERVATIONS") {
      return apiError(409, "SPACE_RESERVED", "Hay reservas futuras");
    }

    return apiError(404, "NOT_FOUND", "No se pudo desactivar el espacio");
  }
}