import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <>
      <AuthForm mode="login" />
      <p className="mt-4 text-sm">
        ¿No tienes cuenta? <Link href="/register" className="text-blue-600">Regístrate</Link>
      </p>
    </>
  );
}