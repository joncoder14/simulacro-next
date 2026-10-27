
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";

export async function PublicHeader() {
  const user = await getSessionUser();

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 p-4">
        <Link href="/" className="text-xl font-bold">
          CoSpace
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/spaces" className="hover:text-blue-600">
            Explorar espacios
          </Link>

          {!user ? (
            <>
              <Link href="/login" className="hover:text-blue-600">
                Iniciar sesión
              </Link>

              <Link href="/register" className="hover:text-blue-600">
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin/spaces"
                  className="hover:text-blue-600"
                >
                  Administrar espacios
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="hover:text-blue-600"
                >
                  Mi panel
                </Link>
              )}

              <span className="text-sm text-gray-600">
                Hola, {user.name}
              </span>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
