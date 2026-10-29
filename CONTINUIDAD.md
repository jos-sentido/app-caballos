# Continuidad — dónde vamos y qué sigue

> Nota de traspaso para retomar el proyecto en una **sesión local de Claude
> Code** (o cualquiera nueva). El historial del chat donde se construyó esto no
> viaja con el repo; este archivo + el `README.md` son el contexto.

_Última actualización: Fase 0 (fundación) terminada y desplegada._

---

## Qué es esto

**Cuaderno de Cuadra** — gestor ecuestre para cuadras (caballos, entrenamiento,
concursos, caballerizas, equipo, finanzas). Multi-cuadra (multi-tenant) y
multiusuario con roles. Es la **implementación real** de un prototipo navegable
(un solo HTML, datos ficticios) que sirve de referencia de producto y diseño.

## Decisiones ya tomadas (no re-litigar sin pedir)

- **Framework:** Next.js 15 (App Router, TypeScript) en **Vercel**.
- **Backend:** **Firebase** (Auth por enlace de correo, Firestore, Storage).
  Se evaluó Supabase; el usuario eligió Firebase.
- **Estilos:** Tailwind v4 + tokens de diseño del prototipo (tinta y hueso,
  Bricolage Grotesque + IBM Plex Sans, claro/oscuro) en `src/app/globals.css`.
- **Repo:** `jos-sentido/app-caballos`, rama por defecto `main` (la fundación se
  subió directo a `main`; no hay rama de desarrollo designada).
- **Idioma del producto y del código/comentarios:** español (MX).
- **Roles:** Operador · Entrenador · Jinete · Dueño · Arrendador. (Caballerango
  es integrante del Equipo, no un rol de permisos.)

## Estado actual (Fase 0 ✅)

- Proyecto Next.js que **compila** (`npm run build`, 15 rutas) y **está en
  producción**: https://app-caballos.vercel.app
- **Auth** por enlace de correo (passwordless), guard de sesión y **onboarding**
  para crear la primera cuadra y elegir roles.
- **Multi-cuadra con roles por membresía** (contextos `useAuth` / `useCuadra`).
- **App shell**: barra superior + cajón lateral con los 9 módulos filtrados por
  rol, cambio de cuadra y cerrar sesión.
- **Reglas de seguridad** de Firestore y Storage (membresía + roles por cuadra).
- **9 páginas de módulo** como placeholders (`ModuleStub`), listas para conectar
  a Firestore.
- Firebase se inicializa de forma perezosa: si faltan las env vars, la app
  arranca y muestra el aviso de "falta configurar Firebase".

## Pendientes del usuario (fuera del código)

1. **Vercel → app-caballos → Settings → Environment Variables**: definir las 6
   variables `NEXT_PUBLIC_FIREBASE_*` (ver `.env.example`) y redeployar.
   _(El MCP de Vercel de la sesión en la nube no tenía permiso de escritura: 403;
   se hace desde el dashboard o con la CLI de Vercel autenticada.)_
2. **Firebase → Authentication → Sign-in method**: activar **Email link
   (passwordless)**.
3. **Firebase → Authentication → Settings → Authorized domains**: agregar
   `app-caballos.vercel.app` (y el dominio final cuando exista).
4. **Reglas**: poner el project-id en `.firebaserc` y
   `firebase deploy --only firestore:rules,storage:rules`.

## Correr en local

```bash
npm install
cp .env.example .env.local     # pega tus 6 valores NEXT_PUBLIC_FIREBASE_*
npm run dev                    # http://localhost:3000
```

Opcional sin tocar datos reales: emuladores
(`NEXT_PUBLIC_USE_FIREBASE_EMULATORS=1` + `npm run emulators`). Detalle en
`README.md`.

## Qué sigue

- **Fase 1 · Modelo de datos.** Definir el esquema completo en Firestore y
  afinar las reglas. Lo clave que el prototipo ya resolvió y hay que modelar:
  - `cuadras/{id}/caballos` — ficha, caballeriza asignada, galería, historial,
    economía (pensión, acuerdo A/B).
  - `cuadras/{id}/ubicaciones` y `/caballerizas` — tarifas, arrendador (puede no
    ser el usuario), ocupación.
  - `cuadras/{id}/equipo` — integrantes, rol, sueldo.
  - `cuadras/{id}/tareas` — pendientes con asignado, caballo/caballeriza,
    categoría, fecha, severidad.
  - `cuadras/{id}/entrenamientos` y `/programas` — bitácora por caballo
    (tipo, duración, condición, media, comentarios) y programas recurrentes que
    generan sesiones + tareas por rol.
  - `cuadras/{id}/concursos` — por **jornada** (día): convocatoria, inscripciones
    (caballo·día·prueba), logística, resultados (lugar/premio por entrada) y
    cierre A/B. Cruce caballo↔concurso para historial deportivo.
  - `cuadras/{id}/proveedores`, `/finanzas`.
  - **Vínculos por caballo con consentimiento** (dueño/jinete/entrenador): el
    siguiente nivel de reglas, a nivel de documento.
- **Fase 2 · Portar módulos** uno por uno. Empezar por **Caballos** o **Tareas**
  (son la base). Reusar la lógica y la UI del prototipo.
- **Fase 3 · Media (Storage), correo (Resend), PDF, asistente IA.**
- **Fase 4 · Dominio propio, quitar restricciones de indexado, lanzamiento.**

## Mapa del código

Ver `README.md` → sección **Estructura**. En corto:
`src/app/` (rutas), `src/components/` (shell, onboarding, stub),
`src/lib/` (firebase, auth, cuadra, modules, types),
`firestore.rules` + `storage.rules` (permisos).
