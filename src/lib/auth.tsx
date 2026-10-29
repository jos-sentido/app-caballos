"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { firebaseConfigured, getFirebase } from "./firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  sendLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const EMAIL_KEY = "cc_signin_email";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const { auth } = getFirebase();

    // Si llegamos desde un enlace mágico de correo, completar el acceso.
    if (typeof window !== "undefined" && isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem(EMAIL_KEY);
      if (!email) email = window.prompt("Confirma tu correo para entrar") || "";
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem(EMAIL_KEY);
            window.history.replaceState(null, "", window.location.pathname);
          })
          .catch(() => {});
      }
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const sendLink = useCallback(async (email: string) => {
    const { auth } = getFirebase();
    const url = `${window.location.origin}/login`;
    await sendSignInLinkToEmail(auth, email, { url, handleCodeInApp: true });
    window.localStorage.setItem(EMAIL_KEY, email);
  }, []);

  const signOut = useCallback(async () => {
    const { auth } = getFirebase();
    await fbSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, configured: firebaseConfigured, sendLink, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
