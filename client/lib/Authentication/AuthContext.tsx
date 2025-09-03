"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

type AuthContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  email: string | null;
  token: string | null;
  login: (email: string, token: string, rememberMe?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // On mount read from cookie
  useEffect(() => {
    const initializeAuth = () => {
      const stored = Cookies.get("kns_token");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
    
          if (parsed?.token) {
            setIsAuthenticated(true);
            setEmail(parsed.email || null);
            setToken(parsed.token || null);
            console.log("[Auth Debug] Authentication successful");
          }
        } catch (err) {
          console.error("[Auth Debug] Cookie parse error:", err);
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);



  const login = (email: string, token: string, rememberMe?: boolean) => {
    Cookies.set(
      "kns_token",
      JSON.stringify({ token, email }),
      { 
        expires: rememberMe ? 30 : 7,
        secure: true,
        sameSite: 'strict'
      }
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

  if (!isInitialized) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, email, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
