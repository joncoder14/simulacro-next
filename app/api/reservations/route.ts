import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { reservationSchema } from "@/lib/schemas/reservation.schema";
import {
  createReservation,
  listUserReservations,
} from "@/lib/services/reservations.service";
import { apiError, apiSuccess } from "@/lib/http/api-response";

export async function GET() {
  const user = await getSessionUser();

  if (!user) return apiError(401, "UNAUTHENTICATED", "Inicia sesión");

  return apiSuccess(await listUserReservations(user.id));
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) return apiError(401, "UNAUTHENTICATED", "Inicia sesión");

  const body: unknown = await request.json().catch(() => null);
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", "Datos inválidos");
  }

  try {
    const reservation = await createReservation({
      userId: user.id,
      spaceId: parsed.data.spaceId,
      startAt: new Date(parsed.data.startAt),
      endAt: new Date(parsed.data.endAt),
    });

    return apiSuccess(reservation, 201);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";

    const messages: Record<string, string> = {
      INVALID_DURATION: "La reserva debe durar de 1 a 4 horas completas",
      INVALID_DATE: "La fecha debe estar dentro de los próximos 30 días",
      OUTSIDE_BUSINESS_HOURS: "Horario permitido: 07:00 a 21:00",
      SPACE_NOT_AVAILABLE: "El espacio no está disponible",
      SPACE_TIME_CONFLICT: "El espacio ya está reservado en ese horario",
      USER_TIME_CONFLICT: "Ya tienes una reserva en ese horario",
      RESERVATION_LIMIT: "Máximo 3 reservas futuras confirmadas",
    };

    if (messages[code]) {
      return apiError(409, code, messages[code]);
    }

    if (code.includes("SERIALIZATION")) {
      return apiError(409, "CONCURRENT_RESERVATION", "Intenta nuevamente");
    }

    throw error;
  }
}