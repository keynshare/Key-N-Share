"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useNotifications } from "@/lib/notification-context";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import type { WalletName } from "@solana/wallet-adapter-base";
// Enhanced error types for better error handling
interface WalletError extends Error {
  code?: number;
  // name?: string;
}

// Connection retry configuration
const CONNECTION_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  backoffMultiplier: 2,
};

export function useWalletConnection() {
  const { 
    wallet, 
    connect, 
    disconnect, 
    connected, 
    connecting, 
    publicKey,
    select,
    wallets,
    disconnecting
  } = useWallet();
  
  const { connection } = useConnection();
  const { notify } = useNotifications();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const isConnecting = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced wallet filtering with better state management
  const availableWallets = useMemo(() => {
    return wallets.filter(w => w.readyState !== 'Unsupported');
  }, [wallets]);

  const installedWallets = useMemo(() => {
    return wallets.filter(w => w.readyState === 'Installed');
  }, [wallets]);

  // Find the best available connector
  const connector = useMemo(() => {
    // Prefer installed wallets
    if (installedWallets.length > 0) {
      return installedWallets[0];
    }
    // Fallback to any available wallet
    return availableWallets[0];
  }, [installedWallets, availableWallets]);

  // Enhanced balance fetching with retry logic
  const fetchBalance = useCallback(async (retryCount = 0): Promise<void> => {
    if (!publicKey || !connection) {
      setBalance(null);
      return;
    }

    setIsLoadingBalance(true);
    setConnectionError(null);

    try {
      const balance = await connection.getBalance(publicKey);
     const solBalance = balance / LAMPORTS_PER_SOL;
     setBalance(Number.isInteger(solBalance) ? solBalance.toString() : solBalance.toFixed(2));
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Error fetching balance:", error);
      
      if (retryCount < CONNECTION_RETRY_CONFIG.maxRetries) {
        const delay = CONNECTION_RETRY_CONFIG.retryDelay * Math.pow(CONNECTION_RETRY_CONFIG.backoffMultiplier, retryCount);
        setRetryCount(retryCount + 1);
        
        retryTimeoutRef.current = setTimeout(() => {
          fetchBalance(retryCount + 1);
        }, delay);
      } else {
        setBalance(null);
        setConnectionError("Failed to fetch balance after multiple attempts");
        notify({ 
          type: "error", 
          message: "Unable to fetch wallet balance. Please check your connection." 
        });
      }
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, connection, notify]);

  // Get balance when wallet is connected
  useEffect(() => {
    fetchBalance();
    
    // Cleanup timeout on unmount
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchBalance]);

  // Enhanced error handling with more specific error messages
  const getFriendlyErrorMessage = useCallback((error: WalletError): string => {
    // if (!error?.message) return "Something went wrong.";

    const message = error.message.toLowerCase();
    const errorCode = error.code;

    // User rejection errors
    if (message.includes("user rejected") || message.includes("rejected") || message.includes("user cancelled")) {
      return "You cancelled the connection request.";
    }

    // Wallet not found errors
    if (message.includes("wallet not found") || message.includes("provider not found") || message.includes("no provider")) {
      return "No wallet detected. Please install Phantom, Solflare, or another Solana wallet.";
    }

    // Wallet not available errors
    if (message.includes("wallet not available") || message.includes("connector not available") || message.includes("not installed")) {
      return "Wallet is not available in this browser. Please install the wallet extension.";
    }

    // Network errors
    if (message.includes("network error") || message.includes("connection failed") || message.includes("timeout")) {
      return "Network connection failed. Please check your internet connection and try again.";
    }

    // RPC errors
    if (message.includes("rpc") || message.includes("endpoint") || errorCode === -32603) {
      return "RPC connection failed. Please try again in a moment.";
    }

    // Rate limiting
    if (message.includes("rate limit") || message.includes("too many requests")) {
      return "Too many requests. Please wait a moment and try again.";
    }

    // Generic fallback
    return "Failed to connect wallet. Please login in to wallet & try again.";
  }, []);

  // Track connection changes with enhanced state management
  useEffect(() => {
    if (connected && isConnecting.current) {
      notify({ type: "success", message: "Wallet connected successfully!" });
      isConnecting.current = false;
      setConnectionError(null);
      setRetryCount(0);
    }
  }, [connected, notify]);

  // Track disconnection
  useEffect(() => {
    if (!connected && !connecting && !disconnecting) {
      setBalance(null);
      setConnectionError(null);
      setRetryCount(0);
    }
  }, [connected, connecting, disconnecting]);

  // Enhanced wallet connection function with retry logic
  const connectWallet = useCallback(async (walletName?: string) => {
    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (!connector && !walletName) {
      notify({ 
        type: "warning", 
        message: "No wallet detected. Please install Phantom, Solflare, or another Solana wallet." 
      });
      return;
    }

    if (connected) {
      notify({ type: "info", message: "Wallet already connected." });
      return;
    }

    if (connecting) {
      notify({ type: "info", message: "Connection already in progress..." });
      return;
    }

    try {
      isConnecting.current = true;
      setConnectionError(null);
      
      // Select the wallet if specified or use connector
      const targetWallet = walletName || connector?.adapter.name;
      if (targetWallet && (!wallet || wallet.adapter.name !== targetWallet)) {
        select(targetWallet as WalletName);
        // Wait for wallet selection to complete
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      await connect();
    } catch (err) {
      isConnecting.current = false;
      const error = err as WalletError;
      console.error("Connection error:", error);

         const isWalletNotSelectedError = error.message?.toLowerCase().includes("wallet not selected") || 
                                      error.name?.toLowerCase().includes("walletnotselectederror");
      
      if (isWalletNotSelectedError && retryCount < CONNECTION_RETRY_CONFIG.maxRetries) {
        console.log(`WalletNotSelectedError detected, retrying... (${retryCount + 1}/${CONNECTION_RETRY_CONFIG.maxRetries})`);
        setRetryCount(prev => prev + 1);
        
        // Retry after a short delay
        retryTimeoutRef.current = setTimeout(() => {
          connectWallet(walletName);
        }, CONNECTION_RETRY_CONFIG.retryDelay);
        return;
      }
      
      const errorMessage = getFriendlyErrorMessage(error);
      setConnectionError(errorMessage);
      notify({ type: "error", message: errorMessage });
    }
  }, [connector, connect, connected, connecting, notify, wallet, select, getFriendlyErrorMessage]);

  // Enhanced wallet disconnection function
  const disconnectWallet = useCallback(async () => {
    if (!connected) {
      notify({ type: "warning", message: "No wallet connected to disconnect." });
      return;
    }

    if (disconnecting) {
      notify({ type: "info", message: "Disconnection already in progress..." });
      return;
    }

    try {
      // Clear any pending retry timeouts
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      await disconnect();
      notify({ type: "info", message: "Wallet disconnected successfully." });
    } catch (err) {
      const error = err as WalletError;
      console.error("Disconnection error:", error);
      notify({ 
        type: "error", 
        message: "Failed to disconnect wallet. Please try again." 
      });
    }
  }, [disconnect, connected, disconnecting, notify]);

  // Retry connection function
  const retryConnection = useCallback(() => {
    if (retryCount < CONNECTION_RETRY_CONFIG.maxRetries) {
      setRetryCount(prev => prev + 1);
      connectWallet();
    }
  }, [retryCount, connectWallet]);

  return {
    // Connection state
    isConnected: connected,
    isConnecting: connecting,
    isDisconnecting: disconnecting,
    isPending: connecting || isLoadingBalance || disconnecting,
    
    // Wallet info
    address: publicKey?.toString() || undefined,
    balance: balance,
    wallet,
    wallets: availableWallets,
    installedWallets,
    
    // Connection management
    connectWallet,
    disconnectWallet,
    retryConnection,
    select,
    
    // Error handling
    connectionError,
    retryCount,
    maxRetries: CONNECTION_RETRY_CONFIG.maxRetries,
    
    // Utility functions
    refreshBalance: () => fetchBalance(0),
  };
}