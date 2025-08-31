"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

type AuthContextType = {
  isAuthenticated: boolean;
  email: string | null;
  token: string | null;
  login: (email: string, token: string, rememberMe?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // On mount read from cookie
  useEffect(() => {
    const stored = Cookies.get("kns_token");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.Token) {
          setIsAuthenticated(true);
          setEmail(parsed.Email || null);
          setToken(parsed.Token || null);
        }
      } catch (err) {
        console.error("Invalid cookie format:", err);
      }
    }
  }, []);

  const login = (email: string, token: string, rememberMe?: boolean) => {
    Cookies.set(
      "kns_token",
      JSON.stringify({ Token: token, Email: email }),
      { expires: rememberMe ? 30 : 7 }
    );
    setIsAuthenticated(true);
    setEmail(email);
    setToken(token);
  };

  const logout = () => {
    Cookies.remove("kns_token");
    setIsAuthenticated(false);
    setEmail(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
