import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <>
      <AuthForm mode="register" />
      <p className="mt-4 text-sm">
        ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600">Inicia sesión</Link>
      </p>
    </>
  );
}