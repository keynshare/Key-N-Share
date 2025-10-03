"use client";

import { useState } from "react";
// Temporarily commented out for build compatibility
// import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, RpcResponseAndContext, SignatureResult } from "@solana/web3.js";
// import { clusterApiUrl } from "@solana/web3.js";
import { userOrdersApi, CreateOrderRequest } from "@/lib/api/UserOrdersApi";
// import { useWallet } from "@solana/wallet-adapter-react";

// Mock implementations for build compatibility
const LAMPORTS_PER_SOL = 1000000000;

class PublicKey {
  constructor(public value: string) {}
  toString(): string { return this.value; }
  toBuffer(): Buffer { return Buffer.from(this.value); }
  static findProgramAddressSync(): [PublicKey, number] { 
    return [new PublicKey("mock"), 0]; 
  }
}

class Connection {
  constructor(public endpoint: string, public commitment?: string) {}
  async getLatestBlockhash(_commitment?: string) { return { blockhash: "mock", lastValidBlockHeight: 0 }; }
  async sendRawTransaction(_rawTransaction: Buffer, _options?: any): Promise<string> { return "mock_signature"; }
  async confirmTransaction(_signature: any, _commitment?: string): Promise<any> { 
    return { value: { confirmationStatus: "confirmed" } }; 
  }
  async getSignatureStatus(_signature: string, _options?: any): Promise<any> { 
    return { value: { confirmationStatus: "confirmed" } }; 
  }
}

class Transaction {
  recentBlockhash?: string;
  feePayer?: PublicKey;
  constructor(options?: any) {}
  add(_instruction: any): Transaction { return this; }
  serialize(): Buffer { return Buffer.from("mock"); }
}

const SystemProgram = {
  transfer: (_params: any) => ({}),
};

// Mock types
interface RpcResponseAndContext<T> {
  value: T;
}

interface SignatureResult {
  confirmationStatus?: string;
}

function clusterApiUrl(_network?: string): string { return "https://api.devnet.solana.com"; }

interface WalletContextState {
  publicKey: PublicKey | null;
  connected: boolean;
}

function useWallet(): WalletContextState {
  return { publicKey: null, connected: false };
}

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

  if (!window.solana.publicKey) {
    await window.solana.connect();
  }

  if (!window.solana.publicKey) {
    throw new Error("Failed to connect to wallet");
  }

  return new PublicKey(window.solana.publicKey.toString());
}
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
    
    if (!window.solana) {
      throw new Error("Phantom wallet not available");
    }
    
    // Recommended: use signAndSendTransaction if available
    if (window.solana.signAndSendTransaction) {
      const result = await window.solana.signAndSendTransaction(tx);
      signature = result.signature;
    } else if (window.solana.signTransaction) {
      // Fallback: signTransaction then sendRawTransaction
      const signed = await window.solana.signTransaction(tx);
      signature = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false
      });
    } else {
      throw new Error("Wallet does not support transaction signing");
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
    const { signature } = await sendSolWithPhantom({
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
