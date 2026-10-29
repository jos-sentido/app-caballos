"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { user, loading, configured, sendLink } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/app");
  }, [loading, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await sendLink(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el enlace.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="card" style={{ width: "100%", maxWidth: 420, padding: 24 }}>
        <div className="eyebrow">Cuaderno de Cuadra</div>
        <h1 style={{ margin: "6px 0 4px", fontSize: "1.5rem" }}>Entra a tu cuadra</h1>
        <p className="lede">Te enviamos un enlace de acceso a tu correo. Sin contraseñas.</p>

        {!configured ? (
          <div
            className="card"
            style={{ marginTop: 16, padding: 14, background: "var(--warn-bg)", borderColor: "transparent" }}
          >
            <b style={{ color: "var(--warn)" }}>Falta configurar Firebase.</b>
            <p style={{ margin: "6px 0 0", fontSize: ".86rem", color: "var(--ink-2)" }}>
              Copia <code>.env.example</code> a <code>.env.local</code> (o define las variables
              <code> NEXT_PUBLIC_FIREBASE_*</code> en Vercel) con los datos de tu proyecto Firebase y
              vuelve a cargar.
            </p>
          </div>
        ) : sent ? (
          <div className="card" style={{ marginTop: 16, padding: 14, background: "var(--pos-bg)", borderColor: "transparent" }}>
            <b style={{ color: "var(--pos)" }}>Revisa tu correo</b>
            <p style={{ margin: "6px 0 0", fontSize: ".86rem", color: "var(--ink-2)" }}>
              Enviamos un enlace de acceso a <b>{email}</b>. Ábrelo en este dispositivo.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 10 }}>
            <input
              className="input"
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Correo electrónico"
            />
            <button className="btn" type="submit" disabled={busy || !email}>
              {busy ? "Enviando…" : "Enviar enlace de acceso"}
            </button>
            {error && <p style={{ color: "var(--neg)", fontSize: ".84rem", margin: 0 }}>{error}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
