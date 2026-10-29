"use client";

import { MODULES } from "@/lib/modules";
import { useCuadra } from "@/lib/cuadra";

const DESC: Record<string, string> = {
  tar: "Pendientes de la cuadra: feed, filtros, calendario y asignación por persona.",
  cab: "Fichas de cada caballo: datos, caballeriza, galería, historial y economía.",
  ent: "Bitácora de trabajo por caballo, calendario de sesiones y programas recurrentes.",
  caz: "Ubicaciones y caballerizas: tarifas, ocupación, mapa y servicios.",
  con: "Concursos por jornada: convocatoria, inscripciones, logística, resultados y cierre A/B.",
  prov: "Marketplace de proveedores y portal de servicios.",
  eq: "Equipo de la cuadra: integrantes, roles y asignación de pendientes.",
  fin: "Cuaderno económico: pensiones, rentas, nómina, premios y por cobrar.",
  perf: "Tus datos de contacto y la gestión de tus roles y vínculos.",
};

export default function ModuleStub({ moduleKey }: { moduleKey: string }) {
  const m = MODULES.find((x) => x.key === moduleKey);
  const { current, roles } = useCuadra();
  if (!m) return null;

  return (
    <section>
      <div className="eyebrow">{current?.nombre}</div>
      <h1 style={{ margin: "4px 0 0", fontSize: "1.6rem", display: "flex", alignItems: "center", gap: 10 }}>
        <span>{m.icon}</span>
        {m.label}
      </h1>
      <p className="lede">{DESC[m.key]}</p>

      <div className="card" style={{ marginTop: 18, padding: 18 }}>
        <span className="beta">En construcción · Fase 2</span>
        <p style={{ margin: "10px 0 0", color: "var(--ink-2)", fontSize: ".92rem" }}>
          La fundación ya está lista: sesión, cuadra, roles, navegación y base de datos. Este módulo se
          conecta a Firestore en la siguiente fase, portando la lógica del prototipo.
        </p>
        <p style={{ margin: "10px 0 0", color: "var(--ink-3)", fontSize: ".82rem" }}>
          {m.roles
            ? `Visible para: ${m.roles.join(" · ")}`
            : "Visible para todos los roles."}
          {roles.length ? ` — tus roles aquí: ${roles.join(", ")}.` : ""}
        </p>
      </div>
    </section>
  );
}
