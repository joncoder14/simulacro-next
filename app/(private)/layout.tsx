export const instant = false;
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/auth-logout-button";

export default async function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin/spaces");
  }

  return (
    <>
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 p-4">
          <Link href="/" className="font-bold">
            CoSpace
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/spaces">Explorar espacios</Link>
            <Link href="/dashboard">Mis reservas</Link>

            <span className="text-sm text-gray-600">
              Hola, {user.name}
            </span>

            <LogoutButton />
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {children}
      </main>
    </>
  );
}
