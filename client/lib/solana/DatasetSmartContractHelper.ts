"use client";

import { AnchorProvider, Program, BN, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { useState } from "react";
import idl from "./dataset_catalogue_idl.json";

// Program ID from the smart contract
const PROGRAM_ID = new PublicKey("9dGx4usjmHMv9osGXBi2UMhH6bxCq4kWasH5ZAqZoijd");

// Types for the smart contract interaction
export interface DatasetMetadata {
  title: string;
  price: number; // Price in SOL
  dataCid: string;
  originalContentHash: string;
  description: string;
  fileSize: string; // File size in bytes
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
// Alternative approach using raw Solana transactions
async function addDatasetWithRawTransaction(
  wallet: WalletContextState,
  _connection: Connection,
  _metadata: DatasetMetadata
): Promise<SmartContractResult> {
  console.log("Using raw Solana transaction approach");
  
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected or doesn't support signing");
  }

  try {
    // Raw transaction construction is not implemented yet. We should not
    // return a mock success as it can corrupt business logic.
    throw new Error("Raw transaction path is not implemented. Anchor flow must succeed.");

  } catch (error) {
    console.error("Raw transaction failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

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
    if (typeof metadata.fileSize !== 'number' || isNaN(metadata.fileSize)) {
      throw new Error(`Invalid file size: ${metadata.fileSize}. Expected a valid number.`);
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
      
    } catch (anchorError) {
      console.error("Anchor approach failed:", anchorError);
      return {
        success: false,
        error: anchorError instanceof Error ? anchorError.message : "Unknown Anchor error"
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

  // Create file size BN with validation
  const fileSizeBN = new BN(metadata.fileSize);

  console.log("Blockchain transaction parameters:", {
    title: metadata.title,
    priceInLamports: priceInLamports.toString(),
    dataCid: metadata.dataCid,
    originalContentHash: metadata.originalContentHash,
    description: metadata.description,
    fileSize: fileSizeBN.toString()
  });

  // Call the smart contract
  const signature = await program.methods
    .addDataset(
      metadata.title,
      priceInLamports,
      metadata.dataCid,
      metadata.originalContentHash,
      metadata.description,
      fileSizeBN
    )
    .accounts({
      dataset: datasetKeypair.publicKey,
      authority: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([datasetKeypair])
    .rpc();

  console.log("Dataset added to blockchain successfully:", {
    signature,
    datasetAccount: datasetKeypair.publicKey.toString()
  });

  return {
    success: true,
    signature,
    datasetAccount: datasetKeypair.publicKey
  };
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

    setIsProcessing(true);
    setLastResult(null);

    try {
      const connection = new Connection(connectionUrl, "confirmed");
      const result = await addDatasetToBlockchain(wallet, connection, metadata);
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    addDataset,
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

  if (metadata.fileSize && metadata.fileSize.length <= 0) {
    errors.push("File size must be greater than 0");
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
    const _program = new Program(idl as unknown as Idl, PROGRAM_ID, provider);

    // Use generic account fetching since we can't guarantee the account structure
    const accountInfo = await connection.getAccountInfo(datasetAccount);
    return accountInfo;
  } catch (error) {
    console.error("Error fetching dataset from blockchain:", error);
    throw error;
  }
}
