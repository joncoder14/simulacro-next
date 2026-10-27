
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/auth-logout-button";

function AdminLoading() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <p className="text-gray-500">Verificando sesión...</p>
    </main>
  );
}

async function AdminContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <>
      <header className="border-b bg-slate-900 p-4 text-white">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link href="/admin/spaces" className="font-bold">
            CoSpace Admin
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/admin/spaces">
              Gestionar espacios
            </Link>

            <Link href="/spaces">
              Explorar espacios
            </Link>

            <span className="text-sm">
              Hola, {user.name}
            </span>

            <LogoutButton />

            <Link href="/">
              Ver sitio público
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {children}
      </main>
    </>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}
