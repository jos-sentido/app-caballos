# Cuaderno de Cuadra — `app-caballos`

Gestor ecuestre para cuadras: caballos, entrenamiento, concursos, caballerizas,
equipo y finanzas. Multi-cuadra (multi-tenant) y multiusuario con roles.

**Stack:** Next.js 15 (App Router, TypeScript) · Firebase (Auth + Firestore +
Storage) · Tailwind v4 · desplegado en Vercel.

> El prototipo navegable (un solo HTML, datos ficticios) sigue siendo la
> referencia de producto y de diseño. Este repo es la implementación real.

---

## Fases

- **Fase 0 · Fundación (este commit):** proyecto, auth por enlace de correo,
  modelo multi-cuadra con roles, reglas de seguridad, app shell con el menú de
  módulos y despliegue en Vercel.
- **Fase 1 · Modelo de datos:** esquema completo en Firestore + reglas afinadas
  (vínculos por caballo con consentimiento).
- **Fase 2 · Portar módulos** uno por uno (empezando por Caballos y Tareas).
- **Fase 3 · Media (Storage), correo (Resend), PDF, asistente IA.**
- **Fase 4 · Dominio propio y lanzamiento.**

---

## Puesta en marcha (local)

1. **Instala dependencias**
   ```bash
   npm install
   ```

2. **Crea el proyecto de Firebase** (https://console.firebase.google.com):
   - Activa **Authentication → Sign-in method → Email link (passwordless)**.
   - Crea **Cloud Firestore** (modo producción).
   - Activa **Storage**.
   - En **⚙️ Configuración del proyecto → Tus apps → Web**, copia el objeto de
     configuración (`apiKey`, `authDomain`, etc.).

3. **Variables de entorno**
   ```bash
   cp .env.example .env.local
   # rellena NEXT_PUBLIC_FIREBASE_* con los valores del paso anterior
   ```

4. **Corre la app**
   ```bash
   npm run dev
   # http://localhost:3000
   ```

### Emuladores (opcional, sin tocar datos reales)

```bash
npm i -g firebase-tools   # una vez
firebase login
# pon NEXT_PUBLIC_USE_FIREBASE_EMULATORS=1 en .env.local
npm run emulators         # en una terminal
npm run dev               # en otra
```

---

## Despliegue de reglas de seguridad

Las reglas de Firestore y Storage viven en este repo y se despliegan con la CLI:

```bash
# en .firebaserc, reemplaza el project id
firebase deploy --only firestore:rules,storage:rules
```

---

## Despliegue (Vercel)

El repo ya está conectado a Vercel. En **Project → Settings → Environment
Variables** define las mismas variables `NEXT_PUBLIC_FIREBASE_*`. Cada push a
`main` genera un despliegue. Sin esas variables, la app arranca pero muestra el
aviso de "falta configurar Firebase" en la pantalla de acceso.

> En Firebase → Authentication → Settings → **Authorized domains**, agrega el
> dominio de Vercel (`*.vercel.app` y tu dominio final) para que el enlace de
> acceso funcione en producción.

---

## Estructura

```
src/
  app/
    layout.tsx            # layout raíz: fuentes + AuthProvider
    globals.css           # tokens de diseño (tinta y hueso) + primitivas
    page.tsx              # → /app
    login/page.tsx        # acceso por enlace de correo
    (app)/
      layout.tsx          # CuadraProvider + AppFrame (guard + onboarding)
      page.tsx            # → /app/tareas
      <modulo>/page.tsx   # tareas, caballos, entrenamiento, caballerizas,
                          # concursos, proveedores, equipo, finanzas, perfil
  components/
    AppFrame.tsx          # guard de sesión + onboarding + shell
    AppShell.tsx          # barra superior + cajón lateral de módulos
    Onboarding.tsx        # crear cuadra y elegir roles
    ModuleStub.tsx        # placeholder de módulo (Fase 2)
    Splash.tsx
  lib/
    firebase.ts           # init perezoso del SDK web
    auth.tsx              # AuthProvider / useAuth
    cuadra.tsx            # CuadraProvider / useCuadra (tenant + roles)
    modules.ts            # definición de módulos y visibilidad por rol
    types.ts              # tipos de dominio
firestore.rules           # permisos (membresía + roles por cuadra)
storage.rules             # media por cuadra
```

## Modelo de datos (Firestore)

```
users/{uid}                         perfil + índice de cuadras
cuadras/{cuadraId}                  la cuadra (tenant)
cuadras/{cuadraId}/miembros/{uid}   { nombre, roles: [...] }
cuadras/{cuadraId}/caballos/...     datos de la cuadra (Fase 1+)
cuadras/{cuadraId}/tareas/...
cuadras/{cuadraId}/entrenamientos/...
cuadras/{cuadraId}/programas/...
cuadras/{cuadraId}/concursos/...
cuadras/{cuadraId}/caballerizas/...
cuadras/{cuadraId}/ubicaciones/...
cuadras/{cuadraId}/equipo/...
cuadras/{cuadraId}/proveedores/...
cuadras/{cuadraId}/finanzas/...
```

**Roles:** Operador · Entrenador · Jinete · Dueño · Arrendador.
