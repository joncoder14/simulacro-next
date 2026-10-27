
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "register";
};

type AuthResponse = {
  success?: boolean;
  data?: {
    role?: string;
  };
  error?: string;
  message?: string;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const body: Record<string, string> = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    if (mode === "register") {
      body.name = String(formData.get("name") ?? "");
    }

    try {
      const response = await fetch(
        `/api/auth/${mode === "login" ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const result: unknown = await response.json();

      if (!response.ok) {
        setError(
          "No fue posible completar la operación. Revisa tus datos.",
        );
        return;
      }

      const data = result as AuthResponse;

      const destination =
        mode === "login" && data.data?.role === "ADMIN"
          ? "/admin/spaces"
          : "/dashboard";

      router.replace(destination);
      router.refresh();
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      </h1>

      {mode === "register" && (
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          placeholder="Nombre"
          className="w-full rounded border p-3"
        />
      )}

      <input
        name="email"
        type="email"
        required
        placeholder="Correo electrónico"
        className="w-full rounded border p-3"
      />

      <input
        name="password"
        type="password"
        required
        minLength={mode === "register" ? 8 : 1}
        maxLength={72}
        placeholder="Contraseña"
        className="w-full rounded border p-3"
      />

      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 p-3 text-white disabled:opacity-50"
      >
        {loading
          ? "Procesando..."
          : mode === "login"
            ? "Entrar"
            : "Registrarme"}
      </button>
    </form>
  );
}
