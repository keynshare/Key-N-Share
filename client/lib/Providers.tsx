"use client";

import React from "react";
import { ThemeProvider } from "@/lib/theme-context";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@/lib/notification-context";
import NotificationCenter from "@/components/SharedComponents/NotificationCenter";
import {LoginModeProvider} from "@/lib/LoginModeContext";

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: "test" }),
  ],
  transports: {
    [polygonAmoy.id]: http(),
  },
});


const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <LoginModeProvider>
            {children}
            </LoginModeProvider>
            <NotificationCenter />
          </NotificationProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
