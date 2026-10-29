// Tipos de dominio del Cuaderno de Cuadra.
// Se irán completando por módulo en la Fase 1 (modelo de datos).

export type Rol = "Operador" | "Entrenador" | "Jinete" | "Dueño" | "Arrendador";

export const ALL_ROLES: Rol[] = [
  "Operador",
  "Entrenador",
  "Jinete",
  "Dueño",
  "Arrendador",
];

/** Perfil del usuario (documento users/{uid}). */
export interface UserProfile {
  uid: string;
  nombre: string;
  email: string;
  /** Índice de cuadras a las que pertenece, para listarlas rápido. */
  cuadras: string[];
  creadoEn?: number;
}

/** La cuadra = tenant (documento cuadras/{cuadraId}). */
export interface Cuadra {
  id: string;
  nombre: string;
  creadoPor: string;
  creadoEn?: number;
}

/** Membresía de un usuario en una cuadra (cuadras/{id}/miembros/{uid}). */
export interface Miembro {
  uid: string;
  nombre: string;
  email?: string;
  roles: Rol[];
}

/** Nombre de cada colección de datos bajo una cuadra. */
export type Coleccion =
  | "caballos"
  | "caballerizas"
  | "ubicaciones"
  | "equipo"
  | "tareas"
  | "entrenamientos"
  | "programas"
  | "concursos"
  | "proveedores"
  | "finanzas";
