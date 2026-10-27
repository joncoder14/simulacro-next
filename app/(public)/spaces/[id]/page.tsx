
export const instant = false;

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSpace } from "@/lib/services/spaces.service";
import { getSessionUser } from "@/lib/auth/session";
import { ReservationForm } from "@/components/reservations/reservation-form";

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [space, user] = await Promise.all([
    getSpace(id),
    getSessionUser(),
  ]);

  if (!space) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl rounded-xl border bg-white p-6">
      {space.imageUrl && (
        <Image
          src={space.imageUrl}
          alt={space.name}
          width={900}
          height={500}
          className="mb-5 h-72 w-full rounded-lg object-cover"
        />
      )}

      <h1 className="text-3xl font-bold">{space.name}</h1>

      <p className="mt-4">{space.description}</p>

      <p className="mt-4">
        Capacidad: {space.capacity} persona(s)
      </p>

      <p className="mt-2 font-semibold">
        ${space.pricePerHour.toLocaleString("es-CO")} COP por hora
      </p>

      <div className="mt-6">
        {!user ? (
          <div className="space-y-3">
            <p className="text-slate-600">
              Inicia sesión para reservar este espacio.
            </p>

            <Link
              href="/login"
              className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Iniciar sesión
            </Link>
          </div>
        ) : user.role === "ADMIN" ? (
          <div className="space-y-3">
            <p className="text-slate-600">
              Has iniciado sesión como administrador. Puedes gestionar
              este espacio desde el panel de administración.
            </p>

            <Link
              href="/admin/spaces"
              className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
            >
              Administrar espacios
            </Link>
          </div>
        ) : (
          <div>
            <ReservationForm
              spaceId={space.id}
              pricePerHour={space.pricePerHour}
            />

            <p className="mt-4">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:underline"
              >
                Consultar mis reservas
              </Link>
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
