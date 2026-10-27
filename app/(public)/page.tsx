
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#F3F4F6] text-[#20242C]">
      {/* Hero */}
      <section className="bg-[#F3F4F6] px-6 py-16 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Encuentra tu próximo espacio
            </span>

            <h1 className="mt-7 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              El lugar ideal para
              <span className="block text-blue-600">
                tus grandes ideas.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Descubre espacios para trabajar, reunirte y crear.
              Explora las opciones disponibles y encuentra un
              lugar que se adapte a lo que necesitas.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/spaces"
                className="rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Explorar espacios
                <span className="ml-2" aria-hidden="true">→</span>
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-slate-200 px-6 py-3.5 font-semibold transition hover:bg-slate-50"
              >
                Crear una cuenta
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span>✓ Explora espacios</span>
              <span>✓ Reserva en línea</span>
              <span>✓ Gestiona tus reservas</span>
            </div>
          </div>

          {/* Imagen decorativa */}
          <div className="relative">
            <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-blue-100 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
                alt="Interior moderno de un espacio de trabajo"
                className="h-[360px] w-full object-cover sm:h-[480px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-7 text-white sm:p-9">
                <p className="text-sm font-medium text-white/80">
                  TU ESPACIO, TU RITMO
                </p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Ideas que encuentran su lugar.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="rounded-2xl border border-[#E1E4E8] bg-[#FAFAFB] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#C7D2FE] hover:shadow-xl hover:shadow-slate-300/30">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Simple y práctico
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Todo lo que necesitas para encontrar tu espacio.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Una experiencia sencilla para explorar opciones,
              organizar tu tiempo y gestionar tus reservas.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Explora
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Consulta los espacios disponibles y revisa sus
                características antes de elegir.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M16 3v4M8 3v4M3 10h18" />
                </svg>
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Reserva
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Selecciona el horario que necesitas y realiza
                tu reserva desde la plataforma.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.5" />
                  <path d="M4 4v4.5h4.5M12 8v4l3 2" />
                </svg>
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Organiza
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Consulta tus reservas y administra tus horarios
                desde tu cuenta.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Sección visual */}
      <section className="bg-[#F3F4F6] px-6 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85"
              alt="Espacio de trabajo compartido"
              loading="lazy"
              className="h-72 w-full object-cover sm:h-96"
            />
          </div>

          <div className="max-w-xl md:pl-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Trabaja a tu manera
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Tu tiempo importa. Encuentra dónde aprovecharlo.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Ya sea para concentrarte, colaborar con otras
              personas o preparar una reunión, CoSpace te ayuda
              a encontrar espacios y gestionar tus reservas
              desde un solo lugar.
            </p>

            <Link
              href="/spaces"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800"
            >
              Descubrir espacios
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 lg:px-12 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#343943] bg-[#242830] px-6 py-14 text-center shadow-xl shadow-slate-400/10 sm:px-12 sm:py-20">
          <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Encuentra tu espacio. Empieza algo extraordinario.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-300">
            Explora las opciones disponibles y encuentra el
            lugar adecuado para tu próxima idea.
          </p>

          <Link
            href="/spaces"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500"
          >
            Explorar espacios
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
