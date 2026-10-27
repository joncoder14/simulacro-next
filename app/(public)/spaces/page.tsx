
export const instant = false;

import Link from "next/link";
import Image from "next/image";
import { listSpaces } from "@/lib/services/spaces.service";

export default async function SpacesPage() {
  const spaces = await listSpaces();

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-5 py-10 text-[#20242C] sm:px-8 sm:py-14 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <span aria-hidden="true">←</span>
              Volver al inicio
            </Link>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Encuentra tu lugar
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Explora nuestros espacios.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Descubre espacios disponibles, consulta sus
              características y encuentra el lugar adecuado
              para tu próxima actividad.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-[#E1E4E8] bg-[#FAFAFB] px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4M8 2v4M3 9h18" />
              </svg>
            </span>

            <div>
              <p className="text-sm font-semibold">
                Reserva en línea
              </p>
              <p className="text-xs text-slate-500">
                Elige el espacio que necesitas
              </p>
            </div>
          </div>
        </header>

        {/* Listado de espacios reales */}
        {spaces.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between border-b border-[#DDE1E6] pb-4">
              <h2 className="text-lg font-semibold">
                Espacios disponibles
              </h2>

              <span className="text-sm text-slate-500">
                {spaces.length}{" "}
                {spaces.length === 1 ? "espacio" : "espacios"}
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {spaces.map((space) => (
                <article
                  key={space.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E1E4E8] bg-[#FAFAFB] transition duration-300 hover:-translate-y-1 hover:border-[#C7D2FE] hover:shadow-xl hover:shadow-slate-300/30"
                >
                  {/* Imagen del espacio */}
                  <div className="relative h-56 overflow-hidden bg-[#E5E7EB]">
                    {space.imageUrl ? (
                      <Image
                        src={space.imageUrl}
                        alt={space.name}
                        width={700}
                        height={450}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          className="h-14 w-14 text-slate-400"
                          aria-hidden="true"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                          />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/25 to-transparent" />
                  </div>

                  {/* Información real */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold tracking-tight">
                      {space.name}
                    </h3>

                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-slate-600">
                      {space.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E5E7EB] pt-5">
                      <div>
                        <p className="text-xs text-slate-500">
                          Precio por hora
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#20242C]">
                          $
                          {space.pricePerHour.toLocaleString("es-CO")}
                          <span className="ml-1 text-xs font-medium text-slate-500">
                            COP
                          </span>
                        </p>
                      </div>

                      <Link
                        href={`/spaces/${space.id}`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Ver detalles
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <section className="rounded-3xl border border-[#E1E4E8] bg-[#FAFAFB] px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E9EBEF] text-slate-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-8 w-8"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Aún no hay espacios disponibles
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
              Cuando haya espacios publicados, podrás
              consultarlos aquí y realizar tus reservas.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-xl border border-[#D1D5DB] px-5 py-3 font-semibold transition hover:bg-[#F3F4F6]"
            >
              Volver al inicio
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
