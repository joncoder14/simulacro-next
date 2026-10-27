
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type ReservationFormProps = {
  spaceId: string;
  pricePerHour: number;
};

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMaxDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);

  return formatLocalDate(date);
}

export function ReservationForm({
  spaceId,
  pricePerHour,
}: ReservationFormProps) {
  const router = useRouter();

  const [date, setDate] = useState(formatLocalDate(new Date()));
  const [startHour, setStartHour] = useState("");
  const [duration, setDuration] = useState("1");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const startHourNumber = Number(startHour);
  const durationNumber = Number(duration);
  const endHour = startHourNumber + durationNumber;

  const canSubmit =
    startHour !== "" &&
    startHourNumber >= 7 &&
    endHour <= 21 &&
    durationNumber >= 1 &&
    durationNumber <= 4;

  async function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!canSubmit) {
      setError(
        "Selecciona una hora válida entre las 7:00 y las 21:00.",
      );
      return;
    }

    const [year, month, day] = date.split("-").map(Number);

    /*
     * Colombia utiliza UTC-5 sin cambio estacional.
     * Convertimos la hora elegida en Colombia a UTC para enviarla
     * correctamente al servidor, aunque el navegador use otra zona.
     */
    const startAt = new Date(
      Date.UTC(year, month - 1, day, startHourNumber + 5),
    );

    const endAt = new Date(
      Date.UTC(year, month - 1, day, endHour + 5),
    );

    if (startAt.getTime() <= Date.now()) {
      setError("Selecciona una fecha y hora futuras.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spaceId,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
        }),
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message === "string"
            ? result.message
            : "No se pudo crear la reserva.";

        setError(message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Error de conexión. Inténtalo nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submitReservation}
      className="mt-6 space-y-4 rounded-xl border bg-white p-5"
    >
      <h2 className="text-xl font-semibold">Reservar este espacio</h2>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Fecha</span>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          min={formatLocalDate(new Date())}
          max={getMaxDate()}
          required
          className="rounded-lg border p-3"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Hora de inicio</span>
        <select
          value={startHour}
          onChange={(event) => setStartHour(event.target.value)}
          required
          className="rounded-lg border p-3"
        >
          <option value="">Selecciona una hora</option>

          {Array.from({ length: 14 }, (_, index) => index + 7).map(
            (hour) => (
              <option key={hour} value={hour}>
                {String(hour).padStart(2, "0")}:00
              </option>
            ),
          )}
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Duración</span>
        <select
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          required
          className="rounded-lg border p-3"
        >
          {[1, 2, 3, 4].map((hours) => (
            <option
              key={hours}
              value={hours}
              disabled={
                startHour !== "" &&
                startHourNumber + hours > 21
              }
            >
              {hours} {hours === 1 ? "hora" : "horas"}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-lg bg-slate-50 p-3">
        <p className="text-sm text-slate-600">Precio por hora</p>

        <p className="font-medium">
          ${pricePerHour.toLocaleString("es-CO")} COP
        </p>

        {canSubmit && (
          <p className="mt-2 font-semibold">
            Total estimado: $
            {(pricePerHour * durationNumber).toLocaleString("es-CO")} COP
          </p>
        )}

        <p className="mt-2 text-xs text-slate-500">
          Horario de Colombia: 7:00 a. m. a 9:00 p. m.
          Las reservas están sujetas a disponibilidad.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving || !canSubmit}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Procesando reserva..." : "Confirmar reserva"}
      </button>
    </form>
  );
}
