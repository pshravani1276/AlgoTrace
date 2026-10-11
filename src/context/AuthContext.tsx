/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://127.0.0.1:5000" : "")
).replace(/\/+$/, "");
const SESSION_INVALID_EVENT = "algotrace:session-invalid";

export interface AppUser {
  id: number;
  name: string;
  displayName: string;
  institution: string;
  email: string;
  phone: string;
}

interface AuthResponse {
  success?: boolean;
  message?: string;
  user?: {
    id: number;
    name: string;
    institution: string;
    email: string;
    phone: string;
  };
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    institution: string,
    phone: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

class AuthenticationError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthenticationError";
    this.status = status;
  }
}

function isAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const response = value as AuthResponse;
  return (
    typeof response.success === "boolean" &&
    (response.message === undefined || typeof response.message === "string")
  );
}

function toAppUser(user: NonNullable<AuthResponse["user"]>): AppUser {
  return {
    ...user,
    displayName: user.name,
  };
}

async function requestAuth(
  endpoint: string,
  body?: Record<string, string>,
): Promise<AuthResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: body ? "POST" : "GET",
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Unable to connect to the AlgoTrace server.");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("The AlgoTrace server returned an invalid response.");
  }

  if (!isAuthResponse(data)) {
    throw new Error("The AlgoTrace server returned an invalid response.");
  }
  if (!response.ok || !data.success) {
    throw new AuthenticationError(
      data.message ?? "Authentication failed.",
      response.status,
    );
  }

  return data;
}

function responseUser(data: AuthResponse): AppUser {
  const user = data.user;
  if (
    !user ||
    !Number.isSafeInteger(user.id) ||
    typeof user.name !== "string" ||
    typeof user.institution !== "string" ||
    typeof user.email !== "string" ||
    typeof user.phone !== "string"
  ) {
    throw new Error("The server did not return a valid user profile.");
  }
  return toAppUser(user);
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await requestAuth("/api/auth/session");
      setUser(responseUser(data));
    } catch (error) {
      if (error instanceof AuthenticationError && error.status === 401) {
        setUser(null);
      } else {
        setUser(null);
        setAuthError(
          error instanceof Error
            ? error.message
            : "Unable to verify your session.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refreshSession(), 0);
    return () => window.clearTimeout(timer);
  }, [refreshSession]);

  useEffect(() => {
    const onSessionInvalid = () => void refreshSession();
    window.addEventListener(SESSION_INVALID_EVENT, onSessionInvalid);
    return () => {
      window.removeEventListener(SESSION_INVALID_EVENT, onSessionInvalid);
    };
  }, [refreshSession]);

  async function login(email: string, password: string) {
    setAuthError(null);
    const data = await requestAuth("/api/auth/login", { email, password });
    setUser(responseUser(data));
  }

  async function signup(
    name: string,
    institution: string,
    phone: string,
    email: string,
    password: string,
  ) {
    setAuthError(null);
    const data = await requestAuth("/api/auth/register", {
      name,
      institution,
      phone,
      email,
      password,
      confirmPassword: password,
    });
    setUser(responseUser(data));
  }

  async function logout() {
    setAuthError(null);
    try {
      await requestAuth("/api/auth/logout", {});
      setUser(null);
    } catch (error) {
      if (error instanceof AuthenticationError && error.status === 401) {
        setUser(null);
        return;
      }
      const message =
        error instanceof Error ? error.message : "Unable to sign out.";
      setAuthError(message);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        signup,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
}
