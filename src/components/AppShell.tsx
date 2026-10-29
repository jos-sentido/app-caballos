"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useCuadra } from "@/lib/cuadra";
import { MODULES, moduleVisible } from "@/lib/modules";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { current, cuadras, roles, setCurrent } = useCuadra();

  const visible = MODULES.filter((m) => moduleVisible(m, roles));
  const activeLabel =
    MODULES.find((m) => pathname === m.path || pathname.startsWith(m.path + "/"))?.label ||
    "Cuaderno de Cuadra";

  return (
    <div style={{ minHeight: "100dvh" }}>
      {/* Barra superior */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          paddingTop: "calc(10px + env(safe-area-inset-top, 0px))",
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "1px solid var(--line)",
            background: "var(--surface)",
            cursor: "pointer",
            fontSize: "1.1rem",
          }}
        >
          ☰
        </button>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.02rem", flex: 1, minWidth: 0 }}>
          {activeLabel}
        </div>
        <span className="beta">Beta</span>
      </header>

      {/* Contenido del módulo */}
      <main style={{ maxWidth: 820, margin: "0 auto", padding: "20px 16px 48px" }}>{children}</main>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(10,15,22,.45)", zIndex: 40 }}
        />
      )}

      {/* Cajón lateral */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          maxWidth: "84vw",
          background: "var(--surface)",
          borderRight: "1px solid var(--line)",
          transform: open ? "translateX(0)" : "translateX(-102%)",
          transition: "transform .22s ease",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
        aria-hidden={!open}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 10px" }}>
          <div>
            <div className="eyebrow">Cuadra</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem" }}>
              {current?.nombre || "—"}
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface)", cursor: "pointer" }}
          >
            ×
          </button>
        </div>

        {/* Cambiar de cuadra */}
        {cuadras.length > 1 && (
          <select
            value={current?.id}
            onChange={(e) => setCurrent(e.target.value)}
            className="input"
            style={{ margin: "0 16px 8px", width: "calc(100% - 32px)" }}
            aria-label="Cambiar de cuadra"
          >
            {cuadras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        )}

        {/* Roles activos */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "4px 16px 12px" }}>
          {roles.length ? (
            roles.map((r) => (
              <span key={r} className="chip" style={{ fontSize: ".7rem" }}>
                {r}
              </span>
            ))
          ) : (
            <span style={{ color: "var(--ink-3)", fontSize: ".78rem" }}>Sin roles asignados</span>
          )}
        </div>

        <nav style={{ overflowY: "auto", padding: "4px 10px", flex: 1 }}>
          {visible.map((m) => {
            const active = pathname === m.path || pathname.startsWith(m.path + "/");
            return (
              <Link
                key={m.key}
                href={m.path}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "11px 12px",
                  borderRadius: 10,
                  marginBottom: 2,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: ".92rem",
                  color: active ? "var(--accent-ink)" : "var(--ink)",
                  background: active ? "var(--accent)" : "transparent",
                }}
              >
                <span style={{ fontSize: "1.05rem" }}>{m.icon}</span>
                {m.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={signOut}
          style={{
            margin: 14,
            padding: "11px",
            borderRadius: 10,
            border: "1px solid var(--line)",
            background: "var(--surface)",
            color: "var(--ink-2)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </aside>
    </div>
  );
}
