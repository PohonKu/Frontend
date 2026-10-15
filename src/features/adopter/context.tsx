"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { api, DataError, session } from "./data";
import { Locale, User } from "./model";
import { messages } from "./messages";
const Context = createContext<{
  locale: Locale;
  text: ReturnType<typeof messages>;
  user: User | null;
  ready: boolean;
  authError: Error | null;
  refreshUser: () => Promise<void>;
  logout: () => void;
} | null>(null);
export function Provider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null),
    [ready, setReady] = useState(false),
    [authError, setAuthError] = useState<Error | null>(null);
  const refreshUser = useCallback(async () => {
    try {
      const nextUser = await api.user();
      setUser(nextUser);
      setAuthError(null);
    } catch (error) {
      setUser(null);
      setAuthError(
        error instanceof DataError && error.status === 401
          ? null
          : (error as Error),
      );
    } finally {
      setReady(true);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(refreshUser);
    const handler = () => {
      void refreshUser();
    };
    window.addEventListener("auth-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("auth-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refreshUser]);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <Context.Provider
      value={{
        locale,
        text: messages(locale),
        user,
        ready,
        authError,
        refreshUser,
        logout: () => {
          session.clear();
          setUser(null);
        },

      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing adopter provider");
  return value;
}
export function useData<T>(
  load: () => Promise<T>,
  dependencies: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null),
    [error, setError] = useState<Error | null>(null),
    [loading, setLoading] = useState(true),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(async () => {
      if (!active) return;
      setLoading(true);
      setError(null);
      try {
        const result = await load();
        if (active) setData(result);
      } catch (error) {
        if (active) setError(error as Error);
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => {
      active = false;
    }; /* Caller dependencies describe the request; stale results are discarded. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, attempt]);
  return { data, error, loading, retry: () => setAttempt((n) => n + 1) };
}
