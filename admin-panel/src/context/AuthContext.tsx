import { createContext, ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import client from "../api/client";

interface JwtPayload {
  sub: string;
  name: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: JwtPayload | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      try {
        const payload = jwtDecode<JwtPayload>(stored);
        setToken(stored);
        setUser(payload);
        client.defaults.headers.common["Authorization"] = `Bearer ${stored}`;
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (newToken: string) => {
    const payload = jwtDecode<JwtPayload>(newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(payload);
    client.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete client.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
