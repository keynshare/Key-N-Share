"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

type AuthContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  userId: string | null;
  token: string | null;
  PublicKeyRSA: string | null | undefined;
  login: (userId: string, token: string, rememberMe?: boolean, publicKeyPEM?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [PublicKeyRSA, setPublicKeyRSA] = useState<string | undefined | null>(null);

  // On mount read from cookie
  useEffect(() => {
    const initializeAuth = () => {
      const stored = Cookies.get("kns_token");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
    
          if (parsed?.token) {
            setIsAuthenticated(true);
            setUserId(parsed.userId || null);
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



  const login = (userId: string, token: string, rememberMe?: boolean, publicKeyPEM?: string) => {
    Cookies.set(
      "kns_token",
      JSON.stringify({ token, userId,publicKeyPEM }),
      { 
        expires: rememberMe ? 30 : 7,
        secure: true,
        sameSite: 'strict'
      }
    );
    setIsAuthenticated(true);
    setUserId(userId);
    setToken(token);
    setPublicKeyRSA(publicKeyPEM);
  };


  const logout = () => {
    Cookies.remove("kns_token");
    setIsAuthenticated(false);
    setUserId(null);
    setToken(null);
  };

  if (!isInitialized) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, userId, token,PublicKeyRSA, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
