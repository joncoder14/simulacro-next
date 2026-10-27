"use client";

import { useState } from "react";

export function LanguageSelector() {
  const [language, setLanguage] = useState("es");

  return (
    <label className="flex items-center gap-2 text-sm">
      Idioma
      <select
        aria-label="Seleccionar idioma"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="rounded border p-2"
      >
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}