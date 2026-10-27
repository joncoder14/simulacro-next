
import { Suspense } from "react";
import { PublicHeader } from "@/components/layout/public-header";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense
        fallback={
          <header className="border-b bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
              <span className="text-xl font-bold">CoSpace</span>
              <span className="text-sm text-gray-500">
                Cargando...
              </span>
            </nav>
          </header>
        }
      >
        <PublicHeader />
      </Suspense>

      <main className="mx-auto max-w-6xl p-6">
        {children}
      </main>

      <footer className="mt-12 border-t bg-white p-6 text-center">
        CoSpace · Tu espacio para trabajar
      </footer>
    </>
  );
}
