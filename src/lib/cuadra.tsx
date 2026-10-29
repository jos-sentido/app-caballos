"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { getFirebase } from "./firebase";
import { useAuth } from "./auth";
import type { Rol } from "./types";

interface CuadraRef {
  id: string;
  nombre: string;
  roles: Rol[];
}

interface CuadraContextValue {
  loading: boolean;
  cuadras: CuadraRef[];
  current: CuadraRef | null;
  roles: Rol[];
  setCurrent: (id: string) => void;
  createCuadra: (nombre: string, roles: Rol[]) => Promise<string>;
  refresh: () => Promise<void>;
}

const CuadraContext = createContext<CuadraContextValue | null>(null);
const CURRENT_KEY = "cc_current_cuadra";

export function CuadraProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cuadras, setCuadras] = useState<CuadraRef[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setCuadras([]);
      setCurrentId(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { db } = getFirebase();

    // Perfil del usuario: lo creamos si aún no existe.
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        nombre: user.displayName || "",
        email: user.email || "",
        cuadras: [],
        creadoEn: serverTimestamp(),
      });
    }
    const ids: string[] = (userSnap.exists() && (userSnap.data().cuadras as string[])) || [];

    const refs: CuadraRef[] = [];
    for (const id of ids) {
      const cSnap = await getDoc(doc(db, "cuadras", id));
      const mSnap = await getDoc(doc(db, "cuadras", id, "miembros", user.uid));
      if (cSnap.exists() && mSnap.exists()) {
        refs.push({
          id,
          nombre: (cSnap.data().nombre as string) || "Cuadra",
          roles: (mSnap.data().roles as Rol[]) || [],
        });
      }
    }
    setCuadras(refs);

    const remembered = typeof window !== "undefined" ? window.localStorage.getItem(CURRENT_KEY) : null;
    const pick = refs.find((r) => r.id === remembered) || refs[0] || null;
    setCurrentId(pick ? pick.id : null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const setCurrent = useCallback((id: string) => {
    setCurrentId(id);
    try {
      window.localStorage.setItem(CURRENT_KEY, id);
    } catch {}
  }, []);

  const createCuadra = useCallback(
    async (nombre: string, roles: Rol[]) => {
      if (!user) throw new Error("Sin sesión");
      const { db } = getFirebase();
      const cuadraRef = doc(collection(db, "cuadras"));
      const batch = writeBatch(db);
      batch.set(cuadraRef, { nombre, creadoPor: user.uid, creadoEn: serverTimestamp() });
      batch.set(doc(db, "cuadras", cuadraRef.id, "miembros", user.uid), {
        uid: user.uid,
        nombre: user.displayName || user.email || "Tú",
        email: user.email || "",
        roles,
      });
      batch.set(
        doc(db, "users", user.uid),
        { cuadras: arrayUnion(cuadraRef.id) },
        { merge: true }
      );
      await batch.commit();
      await load();
      setCurrent(cuadraRef.id);
      return cuadraRef.id;
    },
    [user, load, setCurrent]
  );

  const current = cuadras.find((c) => c.id === currentId) || null;

  return (
    <CuadraContext.Provider
      value={{
        loading,
        cuadras,
        current,
        roles: current?.roles || [],
        setCurrent,
        createCuadra,
        refresh: load,
      }}
    >
      {children}
    </CuadraContext.Provider>
  );
}

export function useCuadra(): CuadraContextValue {
  const ctx = useContext(CuadraContext);
  if (!ctx) throw new Error("useCuadra debe usarse dentro de <CuadraProvider>");
  return ctx;
}
