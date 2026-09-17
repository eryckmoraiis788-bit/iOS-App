import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as auth from "@/lib/local-auth";

const LocalAuthContext = createContext<{ user: auth.LocalUser | null; loading: boolean; signIn: (username: string, password: string, licenseKey: string) => Promise<void>; signOut: () => Promise<void>; refresh: () => Promise<void> }>({ user: null, loading: true, signIn: async () => undefined, signOut: async () => undefined, refresh: async () => undefined });

export function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<auth.LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { setLoading(true); setUser(await auth.me()); setLoading(false); }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const signIn = useCallback(async (username: string, password: string, licenseKey: string) => { setUser(await auth.login(username, password, licenseKey)); }, []);
  const signOut = useCallback(async () => { await auth.clearAuth(); setUser(null); }, []);
  const value = useMemo(() => ({ user, loading, signIn, signOut, refresh }), [loading, refresh, signIn, signOut, user]);
  return <LocalAuthContext.Provider value={value}>{children}</LocalAuthContext.Provider>;
}

export function useLocalAuth() { return useContext(LocalAuthContext); }
