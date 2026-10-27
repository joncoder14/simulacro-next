import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Link href="/" className="mb-6 text-2xl font-bold">CoSpace</Link>
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        {children}
      </div>
    </main>
  );
}