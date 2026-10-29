"use client";

import { CuadraProvider } from "@/lib/cuadra";
import AppFrame from "@/components/AppFrame";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CuadraProvider>
      <AppFrame>{children}</AppFrame>
    </CuadraProvider>
  );
}
