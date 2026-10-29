import type { Rol } from "./types";

/**
 * Los módulos del sistema (idénticos al prototipo). `roles: null` = visible
 * siempre; en otro caso el módulo se muestra solo si el usuario tiene al menos
 * uno de esos roles activos en la cuadra actual.
 */
export interface ModuleDef {
  key: string;
  label: string;
  icon: string;
  path: string;
  roles: Rol[] | null;
}

export const MODULES: ModuleDef[] = [
  { key: "tar", label: "Tareas", icon: "📋", path: "/app/tareas", roles: null },
  { key: "cab", label: "Caballos", icon: "🐴", path: "/app/caballos", roles: ["Operador", "Entrenador", "Jinete", "Dueño"] },
  { key: "ent", label: "Entrenamiento", icon: "🏋️", path: "/app/entrenamiento", roles: ["Operador", "Entrenador", "Jinete", "Dueño"] },
  { key: "caz", label: "Caballerizas", icon: "🏠", path: "/app/caballerizas", roles: ["Operador", "Arrendador", "Dueño"] },
  { key: "con", label: "Concursos", icon: "🏆", path: "/app/concursos", roles: ["Operador", "Entrenador", "Jinete", "Dueño"] },
  { key: "prov", label: "Proveedores", icon: "🧰", path: "/app/proveedores", roles: ["Operador"] },
  { key: "eq", label: "Equipo", icon: "👥", path: "/app/equipo", roles: ["Operador"] },
  { key: "fin", label: "Finanzas", icon: "📊", path: "/app/finanzas", roles: ["Operador"] },
  { key: "perf", label: "Perfil", icon: "👤", path: "/app/perfil", roles: null },
];

export function moduleVisible(m: ModuleDef, roles: Rol[]): boolean {
  if (!m.roles) return true;
  return m.roles.some((r) => roles.includes(r));
}
