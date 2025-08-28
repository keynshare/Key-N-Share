import { createContext, useContext, ReactNode, useState } from 'react';

interface LoginModeContextType {
  isLoginMode: boolean;
  toggleLoginMode: (value?: boolean) => void;
}

const LoginModeContext = createContext<LoginModeContextType | undefined>(undefined);

export function LoginModeProvider({ children }: { children: ReactNode }) {
  const [isLoginMode, setIsLoginMode] = useState(false);

  const toggleLoginMode = (value?: boolean) => {
    if (typeof value === "boolean") {
    setIsLoginMode(value);
  } else {
    setIsLoginMode(prev => !prev);
  }
  };

  return (
    <LoginModeContext.Provider value={{ isLoginMode, toggleLoginMode }}>
      {children}
    </LoginModeContext.Provider>
  );
}

export function useLoginMode() {
  const context = useContext(LoginModeContext);
  if (context === undefined) {
    throw new Error('useLoginMode must be used within a LoginModeProvider');
  }
  return context;
}
