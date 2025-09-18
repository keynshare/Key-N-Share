"use client";

import { useState } from "react";
import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, RpcResponseAndContext, SignatureResult } from "@solana/web3.js";
import { clusterApiUrl } from "@solana/web3.js";
import { userOrdersApi, CreateOrderRequest } from "@/lib/api/UserOrdersApi";
import { useWallet } from "@solana/wallet-adapter-react";

// Types for the payment helper
export interface DatasetPurchaseParams {
  datasetId: string;
  sellerAddress: string;
  price: number; // Price in SOL
  buyerId: string;
  buyerAddress: string;
  token?: string; // Auth token for API calls
}

export interface PaymentResult {
  success: boolean;
  signature?: string;
  order?: {
    _id: string;
    buyerId: string;
    buyerAddress: string;
    datasetId: string;
    txnSign: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
  confirmationStatus?: string;
}

export interface TransactionStatus {
  signature: string;
  status: 'processed' | 'confirmed' | 'finalized' | 'pending' | 'failed';
  confirmation?: RpcResponseAndContext<SignatureResult>;
}

// Helper function to connect to Phantom wallet
async function connectPhantom(): Promise<PublicKey> {
  if (!window.solana || !window.solana.isPhantom) {
    throw new Error("Phantom wallet not found. Please install Phantom wallet.");
  }

  if (!window.solana.isConnected) {
    const response = await window.solana.connect();
    return new PublicKey(response.publicKey.toString());
  }

  return new PublicKey(window.solana.publicKey.toString());
}

// Send SOL via Phantom wallet
export async function sendSolWithPhantom({ 
  toAddress, 
  amountSol 
}: { 
  toAddress: string; 
  amountSol: number; 
}): Promise<{ signature: string; confirmation: RpcResponseAndContext<SignatureResult> }> {
  try {
    // 1) Setup connection to devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // 2) Ensure Phantom is connected and get sender pubkey
    const fromPubkey = await connectPhantom();
    const toPubkey = new PublicKey(toAddress);

    // 3) Build transfer transaction
    const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);
    const ix = SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports
    });

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');

    const tx = new Transaction({
      feePayer: fromPubkey,
      recentBlockhash: blockhash
    }).add(ix);

    // 4) Ask Phantom to sign and send
    let signature: string;
    
    // Recommended: use signAndSendTransaction if available
    if (window.solana.signAndSendTransaction) {
      const result = await window.solana.signAndSendTransaction(tx);
      signature = result.signature;
    } else {
      // Fallback: signTransaction then sendRawTransaction
      const signed = await window.solana.signTransaction(tx);
      signature = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false
      });
    }

    // 5) Confirm transaction
    const confirmation = await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      'finalized'
    );

    return { signature, confirmation };
  } catch (error:unknown) {
    console.error("Error sending SOL:", error);
    throw new Error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Check transaction status
export async function checkTxStatus(signature: string): Promise<string | null> {
  try {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const statusResp = await connection.getSignatureStatus(signature, { 
      searchTransactionHistory: true 
    });
    // Possible values: 'processed' | 'confirmed' | 'finalized' | undefined
    return statusResp?.value?.confirmationStatus || null;
  } catch (error:unknown) {
    console.error("Error checking transaction status:", error);
    return null;
  }
}

// Main helper function to buy a dataset
export async function buyDatasetWithSOL(params: DatasetPurchaseParams): Promise<PaymentResult> {
  const { datasetId, sellerAddress, price, buyerId, buyerAddress, token } = params;

  try {
    // Step 1: Send SOL payment
    console.log(`Initiating payment of ${price} SOL to ${sellerAddress}`);
    const { signature, confirmation } = await sendSolWithPhantom({
      toAddress: sellerAddress,
      amountSol: price
    });

    console.log(`Payment successful! Transaction signature: ${signature}`);

    // Step 2: Check transaction status
    const txStatus = await checkTxStatus(signature);
    console.log(`Transaction status: ${txStatus}`);

    // Step 3: Create order in the system
    const orderRequest: CreateOrderRequest = {
      buyerId,
      buyerAddress,
      datasetId,
      txnSign: signature
    };

    console.log("Creating order in system...");
    const orderResponse = await userOrdersApi.createOrder(orderRequest, token);

    console.log("Order created successfully:", orderResponse);

    return {
      success: true,
      signature,
      order: orderResponse.order,
      confirmationStatus: txStatus || 'confirmed'
    };

  } catch (error:unknown) {
    console.error("Error in buyDatasetWithSOL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// React hook for dataset purchasing
export function useDatasetPurchase() {
  const { publicKey } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<PaymentResult | null>(null);

  const purchaseDataset = async (params: Omit<DatasetPurchaseParams, 'buyerAddress'>) => {
    if (!publicKey) {
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }

    setIsProcessing(true);
    setLastResult(null);

    try {
      const result = await buyDatasetWithSOL({
        ...params,
        buyerAddress: publicKey.toString()
      });
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    purchaseDataset,
    isProcessing,
    lastResult,
    isWalletConnected: !!publicKey,
    walletAddress: publicKey?.toString() || null
  };
}

// Utility function to format SOL amounts
export function formatSOL(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(4);
}

// Utility function to convert SOL to lamports
export function solToLamports(sol: number): number {
  return Math.round(sol * LAMPORTS_PER_SOL);
}

// Utility function to validate Solana address
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

// Example usage component (for reference)
/*
import React, { useState } from 'react';
import { useDatasetPurchase } from '@/lib/solana/DatasetPaymentHelper';

export default function DatasetPurchaseButton({ datasetId, sellerAddress, price, buyerId, token }) {
  const { purchaseDataset, isProcessing, lastResult, isWalletConnected } = useDatasetPurchase();
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!isWalletConnected) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setError(null);
      const result = await purchaseDataset({
        datasetId,
        sellerAddress,
        price,
        buyerId,
        token
      });

      if (result.success) {
        console.log("Purchase successful!", result);
        // Handle success (e.g., redirect to orders page, show success message)
      } else {
        setError(result.error || "Purchase failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  return (
    <div>
      <button 
        onClick={handlePurchase} 
        disabled={isProcessing || !isWalletConnected}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : `Buy for ${price} SOL`}
      </button>
      
      {error && <div className="text-red-500 mt-2">{error}</div>}
      
      {lastResult?.success && (
        <div className="text-green-500 mt-2">
          Purchase successful! Transaction: {lastResult.signature}
        </div>
      )}
    </div>
  );
}
*/
