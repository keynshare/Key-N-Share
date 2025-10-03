declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: any) => Promise<any>;
      signAllTransactions: (transactions: any[]) => Promise<any[]>;
      signAndSendTransaction: (transaction: any) => Promise<{ signature: string }>;
      publicKey?: { toString: () => string };
      isConnected?: boolean;
    };
  }
}

// Mock module declarations for missing Solana packages
declare module '@solana/web3.js' {
  export class PublicKey {
    constructor(value: string | Buffer | Uint8Array | number[]);
    toString(): string;
    toBuffer(): Buffer;
    static findProgramAddressSync(seeds: (Buffer | Uint8Array)[], programId: PublicKey): [PublicKey, number];
  }
  
  export class Connection {
    constructor(endpoint: string, commitment?: string);
    getLatestBlockhash(): Promise<{ blockhash: string }>;
    sendRawTransaction(rawTransaction: Buffer): Promise<string>;
    confirmTransaction(signature: string, commitment?: string): Promise<any>;
    getAccountInfo(publicKey: PublicKey): Promise<any>;
    getMinimumBalanceForRentExemption(space: number): Promise<number>;
  }
  
  export class Transaction {
    recentBlockhash?: string;
    feePayer?: PublicKey;
    add(instruction: any): Transaction;
    serialize(): Buffer;
  }
  
  export const SystemProgram: {
    programId: PublicKey;
    createAccount(params: any): any;
  };
  
  export const LAMPORTS_PER_SOL: number;
}

declare module '@solana/wallet-adapter-react' {
  export interface WalletContextState {
    publicKey: PublicKey | null;
    signTransaction?: (transaction: any) => Promise<any>;
    signAllTransactions?: (transactions: any[]) => Promise<any[]>;
    connected: boolean;
  }
  
  export function useWallet(): WalletContextState;
}

declare module '@coral-xyz/anchor' {
  export class BN {
    constructor(value: number | string);
    toString(): string;
  }
  
  export class AnchorProvider {
    constructor(connection: any, wallet: any, options?: any);
  }
  
  export class Program {
    constructor(idl: any, provider?: any);
    methods: any;
  }
  
  export interface Idl {
    name: string;
    version: string;
    metadata?: { address?: string };
  }
}

export {};
