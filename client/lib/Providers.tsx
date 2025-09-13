"use client";

import React, { useMemo, useCallback } from "react";
import { ThemeProvider } from "@/lib/theme-context";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,

} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@/lib/notification-context";
import { ProcessDialogProvider } from "@/lib/process-dialog-context";
import ProcessDialog from "@/components/SharedComponents/ProcessDialog";
import NotificationCenter from "@/components/SharedComponents/NotificationCenter";
import {LoginModeProvider} from "@/lib/LoginModeContext";
import {AuthProvider} from "@/lib/Authentication/AuthContext";





export function Providers({ children }: { children: React.ReactNode }) {
  // Enhanced network configuration with environment variable support
  const network = useMemo(() => {
    // const envNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    // if (envNetwork === 'mainnet-beta') return WalletAdapterNetwork.Mainnet;
    // if (envNetwork === 'testnet') return WalletAdapterNetwork.Testnet;
    return WalletAdapterNetwork.Devnet; // Default to devnet
  }, []);

  // Enhanced endpoint configuration with fallbacks
  const endpoint = useMemo(() => {
    // Use custom RPC URL if provided
    // if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
    //   return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    // }
    
    // Fallback to cluster API URL
    return clusterApiUrl(network);
  }, [network]);


  const wallets = useMemo(() => {
      const walletAdapters: (
       PhantomWalletAdapter
      | SolflareWalletAdapter
      | TorusWalletAdapter
      | LedgerWalletAdapter
    )[] = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ];

    // Only add LedgerWalletAdapter if not in SSR and properly typed
    if (typeof window !== 'undefined') {
      try {
        walletAdapters.push(new LedgerWalletAdapter() );
      } catch (error) {
        console.warn('LedgerWalletAdapter not available:', error);
      }
    }

    return walletAdapters;
  }, []);

const queryClient = new QueryClient();

  return (
    // <WalletErrorBoundary>
      <ThemeProvider>
        <ConnectionProvider endpoint={endpoint} >
          <WalletProvider 
            wallets={wallets} 
            autoConnect={true}
            localStorageKey="wallet-adapter"
          >
            <WalletModalProvider>
              <QueryClientProvider client={queryClient} >
                <NotificationProvider>
                  <LoginModeProvider>
                    <AuthProvider>
                      <ProcessDialogProvider>
                        {children}
                        <ProcessDialog />
                      </ProcessDialogProvider>
                    </AuthProvider>
                  </LoginModeProvider>
                  <NotificationCenter />
                </NotificationProvider>
              </QueryClientProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
    // </WalletErrorBoundary>
  );
}