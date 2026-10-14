/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000";
const USER_STORAGE_KEY = "algotrace_user";

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
  user?: Omit<AppUser, "displayName">;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    institution: string,
    phone: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

function saveUser(user: Omit<AppUser, "displayName">): AppUser {
  const appUser: AppUser = {
    ...user,
    displayName: user.name,
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
  return appUser;
}

async function requestAuth(
  endpoint: string,
  body: Record<string, string>
): Promise<AuthResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Unable to connect to the AlgoTrace server.");
  }

  const data = await response.json() as AuthResponse;

  if (!response.ok || !data.success || !data.user) {
    throw new Error(data.message ?? "Authentication failed.");
  }

  return data;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AppUser | null>(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AppUser;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  });

  const loading = false;

  async function login(email: string, password: string) {
    const data = await requestAuth("/api/auth/login", { email, password });
    setUser(saveUser(data.user!));
  }

  async function signup(
    name: string,
    institution: string,
    phone: string,
    email: string,
    password: string
  ) {
    const data = await requestAuth("/api/auth/register", {
      name,
      institution,
      phone,
      email,
      password,
      confirmPassword: password,
    });

    setUser(saveUser(data.user!));
  }

  async function logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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
