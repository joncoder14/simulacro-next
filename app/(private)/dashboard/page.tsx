
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Reservation = {
  id: string;
  startAt: string;
  endAt: string;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED";
  space: {
    name: string;
  };
};

function getApiMessage(result: unknown): string | null {
  if (
    typeof result === "object" &&
    result !== null &&
    "message" in result &&
    typeof result.message === "string"
  ) {
    return result.message;
  }

  return null;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function loadReservations() {
    setError("");

    try {
      let response = await fetch("/api/reservations", {
        cache: "no-store",
      });

      // Si el token de acceso expiró, intenta renovarlo una vez.
      if (response.status === 401) {
        const refresh = await fetch("/api/auth/refresh", {
          method: "POST",
        });

        if (refresh.ok) {
          response = await fetch("/api/reservations", {
            cache: "no-store",
          });
        }
      }

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Tu sesión expiró. Inicia sesión nuevamente."
            : getApiMessage(result) ??
                "No se pudieron cargar las reservas.",
        );
        return;
      }

      if (
        typeof result !== "object" ||
        result === null ||
        !("data" in result) ||
        !Array.isArray(result.data)
      ) {
        setError("El servidor devolvió una respuesta inválida.");
        return;
      }

      setReservations(result.data as Reservation[]);
    } catch {
      setError("Error de conexión al cargar las reservas.");
    } finally {
      setLoading(false);
    }
  }
useEffect(() => {
  async function fetchReservations() {
    await loadReservations();
  }

  void fetchReservations();
}, []);
  async function cancelReservation(id: string) {
    setError("");
    setSuccess("");
    setCancellingId(id);

    try {
      const response = await fetch(`/api/reservations/${id}/cancel`, {
        method: "POST",
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          getApiMessage(result) ??
            "No fue posible cancelar. Revisa las reglas de cancelación.",
        );
        return;
      }

      setSuccess("Reserva cancelada correctamente.");
      await loadReservations();
    } catch {
      setError("Error de conexión al cancelar la reserva.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Mis reservas</h1>

        <p className="mt-2 text-gray-600">
          Consulta tus reservas y administra las que tengas confirmadas.
        </p>

        <Link
          href="/spaces"
          className="mt-3 inline-block text-blue-600 hover:underline"
        >
          Explorar espacios
        </Link>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700"
        >
          {success}
        </p>
      )}

      {loading ? (
        <p>Cargando tus reservas...</p>
      ) : reservations.length === 0 ? (
        <div className="rounded-xl border p-6">
          <p>Aún no tienes reservas.</p>

          <Link
            href="/spaces"
            className="mt-3 inline-block text-blue-600 hover:underline"
          >
            Buscar un espacio para reservar
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <article
              key={reservation.id}
              className="rounded-xl border bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">
                  {reservation.space.name}
                </h2>

                <span
                  className={
                    reservation.status === "CONFIRMED"
                      ? "rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                      : "rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  }
                >
                  {reservation.status === "CONFIRMED"
                    ? "Confirmada"
                    : "Cancelada"}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Inicio:</strong> {formatDate(reservation.startAt)}
                </p>

                <p>
                  <strong>Fin:</strong> {formatDate(reservation.endAt)}
                </p>

                <p>
                  <strong>Total:</strong> $
                  {reservation.totalPrice.toLocaleString("es-CO")} COP
                </p>
              </div>

              {reservation.status === "CONFIRMED" && (
                <button
                  type="button"
                  disabled={cancellingId !== null}
                  onClick={() => void cancelReservation(reservation.id)}
                  className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancellingId === reservation.id
                    ? "Cancelando..."
                    : "Cancelar reserva"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
