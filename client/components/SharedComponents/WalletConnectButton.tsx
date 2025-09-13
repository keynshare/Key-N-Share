"use client";

import React, { useState, useEffect } from "react";
import { Wallet, RefreshCw, AlertCircle, CheckCircle, X } from "lucide-react";
import Image from "next/image";
import WalletGradient from '@/components/assets/Wallet.svg';
import PrimaryBtn from "./Btns/PrimaryBtn";
import SecondaryBtn from "./Btns/SecondaryBtn";
import { createPortal } from "react-dom";
import { useWalletConnection } from "@/lib/Authentication/walletConnection";

interface WalletConnectButtonProps {
  className?: string;
  disabled?: boolean;
  showDisconnect?: boolean;
  showBalance?: boolean;
  compact?: boolean;
  connect?: boolean;
}

export default function WalletConnectButton({ 
  className = "", 
  disabled = false, 
  showDisconnect = true,
  showBalance = true,
  compact = false,
  connect = false
}: WalletConnectButtonProps) {
  const { 
    isConnected, 
    isConnecting,
    isDisconnecting,
    balance, 
    isPending, 
    connectWallet, 
    disconnectWallet,
    
    wallets,
    installedWallets,
    
    connectionError,
   
  } = useWalletConnection();
  
  const [showWalletModal, setShowWalletModal] = useState(false);
  // const [showErrorModal, setShowErrorModal] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-hide error modal after 5 seconds
  // useEffect(() => {
  //   if (connectionError) {
  //     setShowErrorModal(true);
  //     const timer = setTimeout(() => {
  //       setShowErrorModal(false);
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [connectionError]);

  const handleConnect = async () => {
    // If no wallets available, the hook will handle the notification
    if (wallets.length === 0) {
      await connectWallet();
      return;
    }

    // If already connected, the hook will handle the notification
    if (isConnected) {
      await connectWallet();
      return;
    }

    // Show wallet selection modal if multiple wallets available
    if (wallets.length > 1) {
      setShowWalletModal(true);
      return;
    }

    // If only one wallet, connect directly
    await connectWallet();
  };

  const handleWalletSelect = async (walletName: string) => {
    try {
      setShowWalletModal(false);
      await connectWallet(walletName);
    } catch (err) {
      console.error("Error selecting wallet:", err);
      // The useWalletConnection hook will handle error notifications
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
  };

 

 

  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    if (isDisconnecting) return "Disconnecting...";
    if (isConnected) {
      if (compact) return "Connected";
      return showBalance && balance ? `${balance} SOL` : "Connected";
    }
    return connect ? "Connect" : "Connect Wallet";
  };

  const getButtonIcon = () => {
    if (isConnecting || isDisconnecting) {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }
    if (isConnected) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Wallet className="w-5 h-5" />;
  };

  // Connected state
  if (isConnected) {
    return (
      <div className={`flex flex-col md:flex-row gap-3 ${className} ${connect ? "w-fit" : "w-full"}`}>
        <PrimaryBtn
          onClick={handleDisconnect}
          disabled={disabled || isDisconnecting}
          sparkelClass="hidden"
          className="w-full"
          Hovered={true}
        >
          {getButtonIcon()}
          {getButtonText()}
        </PrimaryBtn>
        
        {showDisconnect && (
          <SecondaryBtn
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="w-full bg-gray-200 !text-black dark:!text-white dark:hover:!text-black dark:hover:bg-gray-400 hover:!text-white hover:bg-[#c2c2c2] dark:bg-[#3f3f3f]"
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect Wallet"}
          </SecondaryBtn>
        )}

        {/* {showBalance && balance && (
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Balance: {balance} SOL</span>
            <button
              onClick={handleRefreshBalance}
              disabled={isRefreshing}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Refresh balance"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        )} */}
      </div>
    );
  }

 
  return (
    <>
      <div className={className}>
        <PrimaryBtn
          onClick={handleConnect}
          disabled={disabled || isPending}
          sparkelClass="hidden"
          className="w-full"
          Hovered={false}
        >
          {getButtonIcon()}
          {getButtonText()}
        </PrimaryBtn>
      </div>

      {/* Wallet Selection Modal */}
      {showWalletModal && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select a Wallet
              </h3>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {installedWallets.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Installed Wallets
                  </h4>
                  {installedWallets.map((wallet) => (
                    <button
                      key={wallet.adapter.name}
                      onClick={() => handleWalletSelect(wallet.adapter.name)}
                      className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full"
                    >
                      {wallet.adapter.icon && (
                        <img
                          src={wallet.adapter.icon}
                          alt={`${wallet.adapter.name} icon`}
                          className="w-6 h-6"
                        />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {wallet.adapter.name}
                      </span>
                      <span className="ml-auto text-xs text-green-600 dark:text-green-400">
                        Installed
                      </span>
                    </button>
                  ))}
                </div>
              )}
              
              {wallets.filter(w => w.readyState !== 'Installed').length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Other Wallets
                  </h4>
                  {wallets
                    .filter(w => w.readyState !== 'Installed')
                    .map((wallet) => (
                    <button
                      key={wallet.adapter.name}
                      onClick={() => handleWalletSelect(wallet.adapter.name)}
                      className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full"
                    >
                      {wallet.adapter.icon && (
                        <img
                          src={wallet.adapter.icon}
                          alt={`${wallet.adapter.name} icon`}
                          className="w-6 h-6"
                        />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {wallet.adapter.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        , document.body
      )}

      
       
    </>
  );
}