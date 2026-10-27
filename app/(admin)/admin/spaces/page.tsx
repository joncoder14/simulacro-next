
"use client";

import { useEffect, useState, type FormEvent } from "react";

type Space = {
  id: string;
  name: string;
  description: string;
  type: "DESK" | "MEETING_ROOM" | "PHONE_BOOTH";
  pricePerHour: number;
  capacity: number;
  isActive: boolean;
  imageUrl: string | null;
};

function isSpace(value: unknown): value is Space {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "description" in value &&
    typeof value.description === "string" &&
    "type" in value &&
    (value.type === "DESK" ||
      value.type === "MEETING_ROOM" ||
      value.type === "PHONE_BOOTH") &&
    "pricePerHour" in value &&
    typeof value.pricePerHour === "number" &&
    "capacity" in value &&
    typeof value.capacity === "number" &&
    "isActive" in value &&
    typeof value.isActive === "boolean" &&
    "imageUrl" in value &&
    (typeof value.imageUrl === "string" ||
      value.imageUrl === null)
  );
}

function isSpaceArray(value: unknown): value is Space[] {
  return Array.isArray(value) && value.every(isSpace);
}

function getApiMessage(result: unknown): string | null {
  if (
    typeof result === "object" &&
    result !== null &&
    "message" in result &&
    typeof result.message === "string"
  ) {
    return result.message;
  }

  return null;
}

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(
    null,
  );

  // Carga inicial de los espacios.
  useEffect(() => {
    let active = true;

    async function loadInitialSpaces() {
      try {
        const response = await fetch("/api/spaces", {
          cache: "no-store",
        });

        const result: unknown = await response.json();

        if (
          !response.ok ||
          typeof result !== "object" ||
          result === null ||
          !("data" in result) ||
          !isSpaceArray(result.data)
        ) {
          if (active) {
            setError("No se pudo cargar el catálogo.");
          }
          return;
        }

        if (active) {
          setSpaces(result.data);
          setError("");
        }
      } catch {
        if (active) {
          setError("Error de conexión al cargar los espacios.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialSpaces();

    return () => {
      active = false;
    };
  }, []);

  // Actualiza el listado después de crear, editar o desactivar.
  async function loadSpaces() {
    try {
      const response = await fetch("/api/spaces", {
        cache: "no-store",
      });

      const result: unknown = await response.json();

      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("data" in result) ||
        !isSpaceArray(result.data)
      ) {
        setError("No se pudo actualizar el listado.");
        return;
      }

      setSpaces(result.data);
    } catch {
      setError("Error de conexión al actualizar los espacios.");
    }
  }

  // Crea un espacio nuevo o guarda los cambios de uno existente.
  async function saveSpace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const body = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      type: String(formData.get("type") ?? "DESK"),
      pricePerHour: Number(formData.get("pricePerHour")),
      capacity: Number(formData.get("capacity")),
      imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    };

    try {
      const response = await fetch(
        editingSpace
          ? `/api/spaces/${editingSpace.id}`
          : "/api/spaces",
        {
          method: editingSpace ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          getApiMessage(result) ??
            (editingSpace
              ? "No se pudieron guardar los cambios. Verifica los datos."
              : "No se pudo crear el espacio. Verifica los datos."),
        );
        return;
      }

      const wasEditing = editingSpace !== null;

      setEditingSpace(null);
      form.reset();

      setSuccess(
        wasEditing
          ? "Espacio actualizado correctamente."
          : "Espacio creado correctamente.",
      );

      await loadSpaces();
    } catch {
      setError("Error de conexión al guardar el espacio.");
    } finally {
      setSaving(false);
    }
  }

  // Desactiva un espacio sin eliminarlo de la base de datos.
  async function deactivateSpace(id: string) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/spaces/${id}`, {
        method: "DELETE",
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          getApiMessage(result) ??
            "No se pudo desactivar el espacio. Puede tener reservas futuras.",
        );
        return;
      }

      if (editingSpace?.id === id) {
        setEditingSpace(null);
      }

      setSuccess("Espacio desactivado correctamente.");

      await loadSpaces();
    } catch {
      setError("Error de conexión al desactivar el espacio.");
    }
  }

  function startEditing(space: Space) {
    setEditingSpace(space);
    setError("");
    setSuccess("");
  }

  function cancelEditing() {
    setEditingSpace(null);
    setError("");
    setSuccess("");
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">
          Administrar espacios
        </h1>
        <p className="mt-2 text-gray-600">
          Crea, edita y administra los espacios de CoSpace.
        </p>
      </header>

      <form
        key={editingSpace?.id ?? "create"}
        onSubmit={saveSpace}
        className="grid gap-4 rounded-xl border bg-white p-5"
      >
        <h2 className="text-xl font-semibold">
          {editingSpace ? "Editar espacio" : "Crear espacio"}
        </h2>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Nombre</span>
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            defaultValue={editingSpace?.name ?? ""}
            placeholder="Nombre del espacio"
            className="rounded border p-3"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Descripción</span>
          <textarea
            name="description"
            required
            minLength={5}
            maxLength={1000}
            defaultValue={editingSpace?.description ?? ""}
            placeholder="Describe el espacio"
            className="rounded border p-3"
            rows={3}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Tipo de espacio</span>
          <select
            name="type"
            defaultValue={editingSpace?.type ?? "DESK"}
            className="rounded border p-3"
          >
            <option value="DESK">Escritorio</option>
            <option value="MEETING_ROOM">Sala de reuniones</option>
            <option value="PHONE_BOOTH">Cabina telefónica</option>
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">
            Precio por hora (COP)
          </span>
          <input
            name="pricePerHour"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={editingSpace?.pricePerHour ?? ""}
            placeholder="Ej. 15000"
            className="rounded border p-3"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Capacidad</span>
          <input
            name="capacity"
            type="number"
            min={1}
            max={100}
            step={1}
            required
            defaultValue={editingSpace?.capacity ?? 1}
            className="rounded border p-3"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">
            URL de imagen (opcional)
          </span>
          <input
            name="imageUrl"
            type="url"
            defaultValue={editingSpace?.imageUrl ?? ""}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="rounded border p-3"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-blue-600 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : editingSpace
                ? "Guardar cambios"
                : "Crear espacio"}
          </button>

          {editingSpace && (
            <button
              type="button"
              disabled={saving}
              onClick={cancelEditing}
              className="rounded border px-4 py-3 disabled:opacity-50"
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {error && (
        <p
          role="alert"
          className="rounded border border-red-200 bg-red-50 p-3 text-red-700"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded border border-green-200 bg-green-50 p-3 text-green-700"
        >
          {success}
        </p>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Espacios registrados
        </h2>

        {loading ? (
          <p>Cargando espacios...</p>
        ) : spaces.length === 0 ? (
          <p className="text-gray-600">
            No hay espacios activos registrados.
          </p>
        ) : (
          spaces.map((space) => (
            <article
              key={space.id}
              className="flex flex-col justify-between gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <h3 className="font-semibold">{space.name}</h3>

                <p className="text-sm text-gray-600">
                  {space.type === "DESK"
                    ? "Escritorio"
                    : space.type === "MEETING_ROOM"
                      ? "Sala de reuniones"
                      : "Cabina telefónica"}
                </p>

                <p className="text-sm">
                  Precio: $
                  {space.pricePerHour.toLocaleString("es-CO")} COP/hora
                </p>

                <p className="text-sm">
                  Capacidad: {space.capacity} persona(s)
                </p>

                <p
                  className={
                    space.isActive
                      ? "text-sm text-green-700"
                      : "text-sm text-gray-500"
                  }
                >
                  {space.isActive ? "Activo" : "Inactivo"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => startEditing(space)}
                  className="rounded border border-blue-300 px-3 py-2 text-blue-700 hover:bg-blue-50"
                >
                  Editar
                </button>

                <button
                  type="button"
                  disabled={!space.isActive}
                  onClick={() => void deactivateSpace(space.id)}
                  className="rounded border border-red-300 px-3 py-2 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Desactivar
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
