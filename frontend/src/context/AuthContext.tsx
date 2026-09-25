import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// DEMO AUTH. Everything lives in this browser's localStorage — there is no server,
// no session, and no way to trust any of it. Passwords are salted + hashed anyway so
// the demo never teaches the wrong habit, but this is NOT a security boundary.
// Replace with the Laravel AuthController (backend/app/Http/Controllers/AuthController.php)
// before anything real ships.

export interface User {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends User {
  salt: string;
  hash: string;
  createdAt: string;
}

// Returns null on success, or the message to show. (A discriminated union would be
// tidier, but this project builds with strictNullChecks off, which breaks narrowing.)
type Result = string | null;

interface AuthContextType {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<Result>;
  login: (email: string, password: string) => Promise<Result>;
  logout: () => void;
  ready: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "ao-demo-users";
const SESSION_KEY = "ao-demo-session";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* blocked storage: the account just won't persist */
  }
};

const toHex = (buf: ArrayBuffer) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

const hashPassword = async (password: string, salt: string): Promise<string> => {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  return toHex(await crypto.subtle.digest("SHA-256", data));
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const email = read<string | null>(SESSION_KEY, null);
    if (email) {
      const found = read<StoredUser[]>(USERS_KEY, []).find((u) => u.email === email);
      if (found) setUser({ id: found.id, name: found.name, email: found.email });
    }
    setReady(true);
  }, []);

  const startSession = (u: StoredUser) => {
    write(SESSION_KEY, u.email);
    setUser({ id: u.id, name: u.name, email: u.email });
  };

  const register = async (name: string, email: string, password: string): Promise<Result> => {
    const clean = normalizeEmail(email);
    if (!name.trim()) return "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean))
      return "Please enter a valid email address.";
    if (password.length < 8) return "Password must be at least 8 characters.";

    const users = read<StoredUser[]>(USERS_KEY, []);
    if (users.some((u) => u.email === clean))
      return "An account with that email already exists.";

    const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
    const created: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: clean,
      salt,
      hash: await hashPassword(password, salt),
      createdAt: new Date().toISOString(),
    };
    write(USERS_KEY, [...users, created]);
    startSession(created);
    return null;
  };

  const login = async (email: string, password: string): Promise<Result> => {
    const clean = normalizeEmail(email);
    const found = read<StoredUser[]>(USERS_KEY, []).find((u) => u.email === clean);
    // Same message either way, so the form can't be used to enumerate accounts.
    const invalid = "Incorrect email or password.";
    if (!found) return invalid;
    if ((await hashPassword(password, found.salt)) !== found.hash) return invalid;
    startSession(found);
    return null;
  };

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
