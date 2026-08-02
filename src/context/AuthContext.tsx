import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import { 
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import type { 
  User, 
  UserCredential 
} from "firebase/auth";

import { auth, googleProvider } from "../firebase/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<UserCredential>;

  signup: (
  name: string,
  email: string,
  password: string
 ) => Promise<UserCredential>;
  googleLogin: () => Promise<UserCredential>;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function login(
    email: string,
    password: string
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }
  async function signup(
  name: string,
  email: string,
  password: string
): Promise<UserCredential> {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  await updateProfile(
    userCredential.user,
    {
      displayName: name,
    }
  );

  return userCredential;
}
  async function googleLogin(): Promise<UserCredential> {
    return signInWithPopup(auth, googleProvider);
  }

  async function logout(): Promise<void> {
    await signOut(auth);
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}