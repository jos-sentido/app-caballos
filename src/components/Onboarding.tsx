"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCuadra } from "@/lib/cuadra";
import { ALL_ROLES, type Rol } from "@/lib/types";

export default function Onboarding() {
  const { signOut } = useAuth();
  const { createCuadra } = useCuadra();
  const [nombre, setNombre] = useState("");
  // El creador es Operador por defecto; puede añadir sus otros roles.
  const [roles, setRoles] = useState<Rol[]>(["Operador"]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(r: Rol) {
    setRoles((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await createCuadra(nombre.trim() || "Mi cuadra", roles.length ? roles : ["Operador"]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuadra.");
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="card" style={{ width: "100%", maxWidth: 460, padding: 24 }}>
        <div className="eyebrow">Primer paso</div>
        <h1 style={{ margin: "6px 0 4px", fontSize: "1.45rem" }}>Crea tu cuadra</h1>
        <p className="lede">
          Una cuadra agrupa a tus caballos, tu equipo y tus datos. Luego podrás invitar a más
          personas y asignarles roles.
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 18, display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 6, fontSize: ".8rem", fontWeight: 600, color: "var(--ink-2)" }}>
            Nombre de la cuadra
            <input
              className="input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Cuadra El Roble"
              aria-label="Nombre de la cuadra"
            />
          </label>

          <div style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--ink-2)" }}>
              Tus roles en esta cuadra
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {ALL_ROLES.map((r) => (
                <button
                  type="button"
                  key={r}
                  className={`chip${roles.includes(r) ? " on" : ""}`}
                  aria-pressed={roles.includes(r)}
                  onClick={() => toggle(r)}
                >
                  {roles.includes(r) ? "✓ " : "+ "}
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Creando…" : "Crear cuadra"}
          </button>
          {error && <p style={{ color: "var(--neg)", fontSize: ".84rem", margin: 0 }}>{error}</p>}
        </form>

        <button
          type="button"
          onClick={signOut}
          style={{
            marginTop: 14,
            background: "none",
            border: 0,
            color: "var(--ink-3)",
            fontSize: ".82rem",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
