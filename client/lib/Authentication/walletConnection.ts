"use client";
import { useConnect, useAccount, useBalance, useDisconnect } from "wagmi";
import { polygonAmoy } from "wagmi/chains";

export function walletConnection() {
  const { connectors, connect, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address, chainId: polygonAmoy.id });

//take the first connector which has injected
  const connector = connectors[0];

  const connectWallet = () => connector && connect({ connector });
  const disconnectWallet = () => disconnect();

  return {
    isConnected,
    balance: balance?.formatted,
    isPending,
    connectWallet,
    disconnectWallet,
  };
}
