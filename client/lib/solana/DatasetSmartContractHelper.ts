"use client";

import { AnchorProvider, Program, BN, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { useState } from "react";
import idl from "./dataset_catalogue_idl.json";

// Program ID from the smart contract
const PROGRAM_ID = new PublicKey("DPLTAXALPu5PRrWbwB3fYmPjq4o3vBYHm1vRRVJZY7rw");

// Types for the smart contract interaction
export interface DatasetMetadata {
  title: string;
  price: number; // Price in SOL
  dataCid: string;
  originalContentHash: string;
  description: string;
  fileSize: string | number; // File size in bytes (can be string or number)
}

export interface SmartContractResult {
  success: boolean;
  signature?: string;
  datasetAccount?: PublicKey;
  error?: string;
}

// Helper function to get Anchor provider
function getProvider(wallet: WalletContextState, connection: Connection): AnchorProvider {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  return new AnchorProvider(
    connection,
    wallet as never,
    { commitment: "confirmed" }
  );
}

// Helper function to get program instance
function getProgram(provider: AnchorProvider): Program {
  try {
    // For Anchor v0.29, the correct constructor signature is: Program(idl, programId, provider)
    console.log("Attempting to create program with Anchor v0.29 syntax");
    return new Program(idl as unknown as Idl, PROGRAM_ID, provider);
  } catch (error) {
    console.error("Program creation failed:", error);
    throw new Error(`Cannot create Anchor program: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Convert SOL to lamports for price
function solToLamports(sol: number): BN {
  if (typeof sol !== 'number' || isNaN(sol) || sol < 0) {
    throw new Error(`Invalid price value: ${sol}. Price must be a positive number.`);
  }
  return new BN(Math.round(sol * LAMPORTS_PER_SOL));
}

// Main function to add dataset to blockchain


export async function addDatasetToBlockchain(
  wallet: WalletContextState,
  connection: Connection,
  metadata: DatasetMetadata
): Promise<SmartContractResult> {
  try {
    if (!wallet.publicKey) {
      throw new Error("Wallet not connected");
    }

    // Validate metadata before processing
    console.log("Validating metadata:", metadata);
    const validationErrors = validateDatasetMetadata(metadata);
    if (validationErrors.length > 0) {
      throw new Error(`Metadata validation failed: ${validationErrors.join(', ')}`);
    }

    // Additional runtime validation for BN conversion
    if (typeof metadata.price !== 'number' || isNaN(metadata.price)) {
      throw new Error(`Invalid price: ${metadata.price}. Expected a valid number.`);
    }
    // File size can be string or number, but must be valid
    if (metadata.fileSize === null || metadata.fileSize === undefined || metadata.fileSize === '') {
      throw new Error(`Invalid file size: ${metadata.fileSize}. File size is required.`);
    }

    // Try Anchor approach only; do not fallback to mock/raw until implemented
    try {
      // Get provider and program
      console.log("Creating provider with wallet:", wallet.publicKey.toString());
      const provider = getProvider(wallet, connection);
      
      console.log("Creating program with IDL and provider");
      console.log("Program ID:", PROGRAM_ID.toString());
      console.log("IDL structure:", { name: idl.name, version: idl.version, address: (idl as { metadata?: { address?: string } }).metadata?.address });
      
      const program = getProgram(provider);
      console.log("Program created successfully");
      
      // Execute the Anchor transaction
      return await executeAnchorTransaction(program, wallet, metadata);
      
    } catch (anchorError: unknown) {
      console.error("Anchor approach failed:", anchorError);
      
      // Handle specific transaction errors
      let errorMessage = "Unknown Anchor error";
      
      if (anchorError instanceof Error) {
        errorMessage = anchorError.message;
        
        // Provide more user-friendly error messages
        if (anchorError.message.includes("already been processed")) {
          errorMessage = "Transaction already processed. Please try again with a different dataset or wait a moment.";
        } else if (anchorError.message.includes("insufficient funds")) {
          errorMessage = "Insufficient SOL balance. Please add more SOL to your wallet.";
        } else if (anchorError.message.includes("User rejected")) {
          errorMessage = "Transaction was rejected by user.";
        } else if (anchorError.message.includes("Blockhash not found")) {
          errorMessage = "Transaction expired. Please try again.";
        } else if (anchorError.message.includes("Transaction simulation failed")) {
          errorMessage = "Transaction simulation failed. Please check your wallet connection and try again.";
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }

  } catch (error: unknown) {
    console.error("Error adding dataset to blockchain:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Execute Anchor transaction
async function executeAnchorTransaction(
  program: Program,
  wallet: WalletContextState,
  metadata: DatasetMetadata
): Promise<SmartContractResult> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  // Generate a new keypair for the dataset account
  const datasetKeypair = Keypair.generate();

  // Convert price to lamports
  const priceInLamports = solToLamports(metadata.price);

  console.log("Adding dataset to blockchain with metadata:", {
    ...metadata,
    priceInLamports: priceInLamports.toString(),
    datasetAccount: datasetKeypair.publicKey.toString(),
    authority: wallet.publicKey.toString()
  });

  // Validate file size is a string (as expected by smart contract)
  const fileSizeString = typeof metadata.fileSize === 'string' ? metadata.fileSize : metadata.fileSize.toString();

  console.log("Blockchain transaction parameters:", {
    title: metadata.title,
    priceInLamports: priceInLamports.toString(),
    dataCid: metadata.dataCid,
    originalContentHash: metadata.originalContentHash,
    description: metadata.description,
    fileSize: fileSizeString
  });

  // Retry mechanism for transaction failures
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Transaction attempt ${attempt}/${maxRetries}`);
      
      // Call the smart contract with fresh blockhash
      const signature = await program.methods
        .addDataset(
          metadata.title,
          priceInLamports,
          metadata.dataCid,
          metadata.originalContentHash,
          metadata.description,
          fileSizeString
        )
        .accounts({
          dataset: datasetKeypair.publicKey,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([datasetKeypair])
        .rpc({
          skipPreflight: false,
          preflightCommitment: "confirmed",
          commitment: "confirmed"
        });

      console.log("Dataset added to blockchain successfully:", {
        signature,
        datasetAccount: datasetKeypair.publicKey.toString()
      });

      return {
        success: true,
        signature,
        datasetAccount: datasetKeypair.publicKey
      };

    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Transaction attempt ${attempt} failed:`, error);

      // Check if it's a duplicate transaction error
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorWithLogs = error as { transactionLogs?: string[] };
      
      if (errorMessage.includes("already been processed") || 
          errorMessage.includes("duplicate") ||
          errorWithLogs?.transactionLogs?.some((log: string) => log.includes("already been processed"))) {
        
        console.log("Duplicate transaction detected, generating new keypair and retrying...");
        
        // Generate a new keypair for the next attempt to avoid duplicate
        const newDatasetKeypair = Keypair.generate();
        // Create a new keypair object instead of modifying the existing one
        Object.assign(datasetKeypair, newDatasetKeypair);
        
        // Add a small delay before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      // If it's not a duplicate error and not the last attempt, wait and retry
      if (attempt < maxRetries) {
        console.log(`Retrying in ${1000 * attempt}ms...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      // If all retries failed, throw the last error
      throw error;
    }
  }

  // This should never be reached, but just in case
  throw lastError || new Error("Transaction failed after all retry attempts");
}

// Transaction deduplication cache
const transactionCache = new Map<string, { timestamp: number; result: SmartContractResult }>();
const CACHE_DURATION = 30000; // 30 seconds

// Utility function to generate Solana Explorer URL for transactions
export function getSolanaExplorerUrl(signature: string, cluster: 'mainnet' | 'testnet' | 'devnet' = 'devnet'): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
}

// Utility function to generate Solana Explorer URL for accounts
export function getSolanaExplorerAccountUrl(address: string, cluster: 'mainnet' | 'testnet' | 'devnet' = 'devnet'): string {
  return `https://explorer.solana.com/address/${address}?cluster=${cluster}`;
}

// React hook for smart contract interaction
export function useDatasetSmartContract() {
  const wallet = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<SmartContractResult | null>(null);

  const addDataset = async (
    metadata: DatasetMetadata,
    connectionUrl: string = "https://api.devnet.solana.com"
  ) => {
    if (!wallet.publicKey) {
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }

    // Create a unique key for this transaction based on metadata and wallet
    const transactionKey = `${wallet.publicKey.toString()}-${metadata.title}-${metadata.dataCid}-${metadata.originalContentHash}`;
    
    // Check if we have a recent result for this exact transaction
    const cached = transactionCache.get(transactionKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Returning cached result for duplicate transaction");
      setLastResult(cached.result);
      return cached.result;
    }

    setIsProcessing(true);
    setLastResult(null);

    try {
      const connection = new Connection(connectionUrl, "confirmed");
      const result = await addDatasetToBlockchain(wallet, connection, metadata);
      
      // Cache successful results
      if (result.success) {
        transactionCache.set(transactionKey, {
          timestamp: Date.now(),
          result
        });
        
        // Clean up old cache entries
        for (const [key, value] of transactionCache.entries()) {
          if (Date.now() - value.timestamp > CACHE_DURATION) {
            transactionCache.delete(key);
          }
        }
      }
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  const getDatasetBySignature = async (
    transactionSignature: string,
    connectionUrl: string = "https://api.devnet.solana.com"
  ) => {
    const connection = new Connection(connectionUrl, "confirmed");
    return await getDatasetByTransactionSignature(connection, transactionSignature);
  };

  const getDatasetByAccount = async (
    datasetAccount: PublicKey,
    connectionUrl: string = "https://api.devnet.solana.com"
  ) => {
    const connection = new Connection(connectionUrl, "confirmed");
    return await getDatasetFromBlockchain(connection, datasetAccount);
  };

  return {
    addDataset,
    getDatasetBySignature,
    getDatasetByAccount,
    isProcessing,
    lastResult,
    isWalletConnected: !!wallet.publicKey,
    walletAddress: wallet.publicKey?.toString() || null
  };
}

// Utility function to validate dataset metadata
export function validateDatasetMetadata(metadata: DatasetMetadata): string[] {
  const errors: string[] = [];

  if (!metadata.title || metadata.title.trim().length === 0) {
    errors.push("Title is required");
  }
  if (metadata.title && metadata.title.length > 256) {
    errors.push("Title must be less than 256 characters");
  }

  if (!metadata.description || metadata.description.trim().length === 0) {
    errors.push("Description is required");
  }
  if (metadata.description && metadata.description.length > 1024) {
    errors.push("Description must be less than 1024 characters");
  }

  if (!metadata.dataCid || metadata.dataCid.trim().length === 0) {
    errors.push("Data CID is required");
  }
  if (metadata.dataCid && metadata.dataCid.length > 256) {
    errors.push("Data CID must be less than 256 characters");
  }

  if (!metadata.originalContentHash || metadata.originalContentHash.trim().length === 0) {
    errors.push("Original content hash is required");
  }
  if (metadata.originalContentHash && metadata.originalContentHash.length > 256) {
    errors.push("Original content hash must be less than 256 characters");
  }

  if (metadata.price <= 0) {
    errors.push("Price must be greater than 0");
  }

  if (!metadata.fileSize || metadata.fileSize.toString().length <= 0) {
    errors.push("File size is required");
  }

  return errors;
}

// Utility function to get dataset account info from blockchain
export async function getDatasetFromBlockchain(
  connection: Connection,
  datasetAccount: PublicKey
): Promise<unknown> {
  try {
    // Create a dummy wallet for read-only operations
    const dummyWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: async () => { throw new Error("Read-only wallet"); },
      signAllTransactions: async () => { throw new Error("Read-only wallet"); }
    };

    const provider = new AnchorProvider(connection, dummyWallet as never, { commitment: "confirmed" });
    const program = new Program(idl as unknown as Idl, PROGRAM_ID, provider);

    // Fetch the dataset account data using the program
    const datasetAccountData = await program.account.dataset.fetch(datasetAccount);
    return datasetAccountData;
  } catch (error) {
    console.error("Error fetching dataset from blockchain:", error);
    throw error;
  }
}

// Utility function to get dataset data using transaction signature
export async function getDatasetByTransactionSignature(
  connection: Connection,
  transactionSignature: string
): Promise<{ datasetData: unknown; datasetAccount: PublicKey } | null> {
  try {
    // Get transaction details
    const transaction = await connection.getTransaction(transactionSignature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Get account keys from the transaction
    const accountKeys = transaction.transaction.message.getAccountKeys();
    
    // Find the dataset account from the transaction
    // The dataset account is typically the first new account created
    // We'll use the first non-signer account as the dataset account
    let datasetAccount: PublicKey | undefined;
    for (let i = 0; i < accountKeys.length; i++) {
      const account = accountKeys.get(i);
      if (account) {
        // Check if this is not a signer (dataset accounts are not signers)
        const isSigner = transaction.transaction.message.header.numRequiredSignatures > 0 && 
                        i < transaction.transaction.message.header.numRequiredSignatures;
        if (!isSigner) {
          datasetAccount = account;
          break;
        }
      }
    }

    if (!datasetAccount) {
      throw new Error("Dataset account not found in transaction");
    }

    // Fetch the dataset data
    const datasetData = await getDatasetFromBlockchain(connection, datasetAccount);
    
    return {
      datasetData,
      datasetAccount
    };
  } catch (error) {
    console.error("Error fetching dataset by transaction signature:", error);
    return null;
  }
}
