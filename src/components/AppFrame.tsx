"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useCuadra } from "@/lib/cuadra";
import Splash from "./Splash";
import Onboarding from "./Onboarding";
import AppShell from "./AppShell";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, configured } = useAuth();
  const { loading: cuadraLoading, current } = useCuadra();
  const router = useRouter();

  useEffect(() => {
    if (configured && !authLoading && !user) router.replace("/login");
  }, [configured, authLoading, user, router]);

  if (!configured) {
    // Sin Firebase configurado no hay sesión posible: manda al login,
    // que explica cómo configurarlo.
    return <LoginRedirect />;
  }
  if (authLoading || !user) return <Splash text="Entrando…" />;
  if (cuadraLoading) return <Splash text="Cargando tu cuadra…" />;
  if (!current) return <Onboarding />;

  return <AppShell>{children}</AppShell>;
}

function LoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return <Splash text="Redirigiendo…" />;
}
