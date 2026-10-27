import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { cancelReservation } from "@/lib/services/reservations.service";
import { apiError, apiSuccess } from "@/lib/http/api-response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: NextRequest,
  context: RouteContext
) {
  const user = await getSessionUser();

  if (!user) return apiError(401, "UNAUTHENTICATED", "Inicia sesión");

  const { id } = await context.params;

  try {
    return apiSuccess(
      await cancelReservation(id, user.id, user.role === "ADMIN")
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : "";

    const errors: Record<string, [number, string]> = {
      RESERVATION_NOT_FOUND: [404, "Reserva no encontrada"],
      FORBIDDEN: [403, "No puedes cancelar esta reserva"],
      ALREADY_CANCELLED: [409, "La reserva ya está cancelada"],
      CANCELLATION_TOO_LATE: [409, "Solo puedes cancelar hasta 2 horas antes"],
    };

    const result = errors[code];

    if (result) return apiError(result[0], code, result[1]);

    throw error;
  }
}