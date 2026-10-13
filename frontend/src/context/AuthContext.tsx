import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// Real accounts, backed by the Laravel API (CustomerAuthController) with Sanctum bearer
// tokens. The token lives in localStorage so a refresh keeps you signed in; that means an
// XSS hole would expose it, which is the usual trade-off for a token SPA. Nothing sensitive
// is kept client-side: the token only reaches /api/customer/* and only ever sees that
// customer's own orders.

export interface User {
  id: number;
  name: string;
  email: string;
}

type Result = string | null; // null on success, else the message to show

interface AuthContextType {
  user: User | null;
  token: string | null;
  register: (name: string, email: string, password: string) => Promise<Result>;
  login: (email: string, password: string) => Promise<Result>;
  logout: () => void;
  ready: boolean;
  authFetch: (path: string, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "ao-token";
const API = () => import.meta.env.VITE_BASE_URL;

const readToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null; // private mode / blocked storage: sign-in just won't persist
  }
};

const writeToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

/** Turns a Laravel error response into one sentence for the user. */
const messageFrom = async (res: Response): Promise<string> => {
  const data = await res.json().catch(() => ({} as Record<string, unknown>));
  const errors = (data as { errors?: Record<string, string[]> }).errors;
  if (errors) {
    const first = Object.values(errors)[0];
    if (first?.[0]) return first[0];
  }
  const message = (data as { message?: string }).message;
  if (message && res.status !== 500) return message;
  return "Something went wrong. Please try again.";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(readToken);
  const [ready, setReady] = useState(false);

  // Restore the session on load. A rejected token means it was revoked or expired.
  useEffect(() => {
    const stored = readToken();
    if (!stored) {
      setReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API()}/api/customer/me`, {
          headers: { Authorization: `Bearer ${stored}`, Accept: "application/json" },
        });
        if (cancelled) return;
        if (res.ok) {
          setUser(await res.json());
        } else if (res.status === 401) {
          writeToken(null);
          setToken(null);
        }
        // Other failures (server down, offline) keep the token: the user is probably
        // still signed in, we just couldn't check right now.
      } catch {
        /* offline — keep the token and try again next load */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const authenticate = async (path: string, body: Record<string, string>): Promise<Result> => {
    try {
      const res = await fetch(`${API()}/api/customer/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) return await messageFrom(res);

      const data = await res.json();
      writeToken(data.token);
      setToken(data.token);
      setUser(data.customer);
      return null;
    } catch {
      return "We couldn't reach the store. Check your connection and try again.";
    }
  };

  const register = (name: string, email: string, password: string) =>
    authenticate("register", { name, email, password });

  const login = (email: string, password: string) =>
    authenticate("login", { email, password });

  const logout = useCallback(() => {
    const stored = readToken();
    // Clear locally first: signing out must work even if the request fails.
    writeToken(null);
    setToken(null);
    setUser(null);
    if (stored) {
      fetch(`${API()}/api/customer/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${stored}`, Accept: "application/json" },
      }).catch(() => {
        /* best effort: the token is gone from this browser either way */
      });
    }
  }, []);

  const authFetch = useCallback(
    (path: string, init: RequestInit = {}) =>
      fetch(`${API()}${path}`, {
        ...init,
        headers: {
          ...(init.headers ?? {}),
          Accept: "application/json",
          ...(readToken() ? { Authorization: `Bearer ${readToken()}` } : {}),
        },
      }),
    []
  );

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, ready, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
