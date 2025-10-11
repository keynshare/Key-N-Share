"use client";

import React from "react";
import { ExternalLink, Hash, Shield } from "lucide-react";
import { getSolanaExplorerUrl, getSolanaExplorerAccountUrl } from "@/lib/solana/DatasetSmartContractHelper";

interface BlockchainInfoProps {
  blockchainSignature?: string;
  blockchainAccount?: string;
  blockchainNetwork?: string;
  className?: string;
}

export default function BlockchainInfo({
  blockchainSignature,
  blockchainAccount,
  blockchainNetwork,
  className = ""
}: BlockchainInfoProps) {
  // Don't render if no blockchain data is available
  if (!blockchainSignature && !blockchainAccount) {
    return null;
  }

  const network = (blockchainNetwork as 'devnet' | 'testnet' | 'mainnet') || 'devnet';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Blockchain Information
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blockchainSignature && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Transaction Signature
            </label>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <code className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1 truncate">
                {blockchainSignature}
              </code>
              <a
                href={getSolanaExplorerUrl(blockchainSignature, network)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
                title="View on Solana Explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
        
        {blockchainAccount && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Dataset Account
            </label>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <code className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1 truncate">
                {blockchainAccount}
              </code>
              <a
                href={getSolanaExplorerAccountUrl(blockchainAccount, network)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
                title="View Account on Solana Explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
        
        {blockchainNetwork && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Network
            </label>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                blockchainNetwork === 'mainnet' ? 'bg-green-500' :
                blockchainNetwork === 'testnet' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {blockchainNetwork}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This dataset is stored on the Solana blockchain. Click the external link icons to view transaction details and account information on the <a 
            href="https://explorer.solana.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Solana Explorer
          </a>.
        </p>
      </div>
    </div>
  );
}
