"use client";
import { useConnect, useAccount, useBalance, useDisconnect } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { useNotifications } from "@/lib/notification-context";
import { useEffect, useRef, useCallback } from "react";

export function useWalletConnection() {
  const { connectors, connect, error, status: connectStatus, isPending } = useConnect();
  const { address, status: accountStatus } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address, chainId: polygonAmoy.id });
  const { notify } = useNotifications();

  const isConnecting = useRef(false);

  const connector = connectors.find(c => c.id === "injected");

  function getFriendlyErrorMessage(error: Error): string {
  if (!error?.message) return "Something went wrong.";

  if (error.message.includes("Provider not found")) {
    return "No wallet detected. Please install MetaMask or another wallet.";
  }
  if (error.message.includes("User rejected")) {
    return "You rejected the connection request.";
  }
  if (error.message.includes("Connector not available")) {
    return "Wallet is not available in this browser.";
  }

  return "Failed to connect wallet. Please try again.";
}


  // Track connection changes
  useEffect(() => {
    if (accountStatus === "connected" && isConnecting.current) {
      notify({ type: "success", message: "Wallet connected successfully!" });
      isConnecting.current = false;
    }

    if (connectStatus === "error" && error) {
      notify({ type: "error", message: getFriendlyErrorMessage(error) });
      isConnecting.current = false;
    }
  }, [accountStatus, connectStatus, error, notify]);


  //wallet Connection function
  const connectWallet = useCallback(async () => {
    if (!connector) {
      notify({ type: "warning", message: "No wallet detected. Please install MetaMask or another wallet." });
      return;
    }

    if (accountStatus === "connected") {
      notify({ type: "info", message: "Wallet already connected." });
      return;
    }

    try {
      isConnecting.current = true;
      await connect({ connector });
    } catch (err) {
      isConnecting.current = false;
      notify({ type: "error", message: "Failed to connect wallet." });
      console.error(err);
    }
  }, [connector, connect, accountStatus, notify]);

  // wallet disconnection function
  const disconnectWallet = useCallback(async () => {
    if (accountStatus !== "connected") {
      notify({ type: "warning", message: "No wallet connected to disconnect." });
      return;
    }

    try {
      await disconnect();
      notify({ type: "info", message: "Wallet disconnected." });
    } catch (err) {
      notify({ type: "error", message: "Failed to disconnect wallet." });
      console.error(err);
    }
  }, [disconnect, accountStatus, notify]);

  return {
    isConnected: accountStatus === "connected",
    balance: balance?.formatted,
    isPending,
    connectWallet,
    disconnectWallet,
  };
}
