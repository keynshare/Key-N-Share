"use client";

import React, { useState } from 'react';
import { useDatasetPurchase, PaymentResult } from '@/lib/solana/DatasetPaymentHelper';
import { useAuth } from '@/lib/Authentication/AuthContext';
import { useNotifications } from '@/lib/notification-context';
import WalletConnectButton from '@/components/SharedComponents/WalletConnectButton';
import { ShoppingCart, Loader2, CheckCircle } from 'lucide-react';

interface DatasetPurchaseButtonProps {
  datasetId: string;
  sellerAddress: string;
  price: number; // Price in SOL
  datasetTitle?: string;
  className?: string;
  onPurchaseSuccess?: (result: PaymentResult) => void;
  onPurchaseError?: (error: string) => void;
}

export default function DatasetPurchaseButton({
  datasetId,
  sellerAddress,
  price,
  datasetTitle = "Dataset",
  className = "",
  onPurchaseSuccess,
  onPurchaseError
}: DatasetPurchaseButtonProps) {
  const { userId, token } = useAuth();
  const { notify, reportError } = useNotifications();
  const { 
    purchaseDataset, 
    isProcessing, 
    lastResult, 
    isWalletConnected, 
    walletAddress 
  } = useDatasetPurchase();
  
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchase = async () => {
    if (!isWalletConnected) {
      reportError("Please connect your wallet first");
      return;
    }

    if (!userId) {
      reportError("Please log in to purchase datasets");
      return;
    }

    if (!token) {
      reportError("Authentication token not found. Please log in again.");
      return;
    }

    try {
      setShowSuccess(false);
      
      const result = await purchaseDataset({
        datasetId,
        sellerAddress,
        price,
        buyerId: userId,
        token
      });

      if (result.success) {
        console.log("Purchase successful!", result);
        console.log("Transaction ID:", result.signature);
        setShowSuccess(true);
        notify({ message: 'Dataset purchased successfully!', type: 'success' });
        onPurchaseSuccess?.(result);
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        const errorMessage = result.error || "Purchase failed";
        reportError(errorMessage);
        onPurchaseError?.(errorMessage);
      }
    } catch (err) {
      console.error("Purchase error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      reportError(errorMessage);
      onPurchaseError?.(errorMessage);
    }
  };

  const formatPrice = (solAmount: number) => {
    return solAmount.toFixed(4);
  };





  return (
    <div className={`space-y-3 ${className}`}>
      {/* Purchase Button */}
      <button 
        onClick={handlePurchase} 
        disabled={isProcessing}
        className={`
          w-full flex items-center justify-center sm:text-base text-sm gap-2 px-4 py-[10px] rounded-lg font-medium
          transition-all duration-200 transform 
          ${isProcessing 
            ? 'bg-[#292929] text-white cursor-not-allowed' 
            : 'bg-[#101010] dark:bg-[#242424] hover:bg-[#e4e4e4] dark:hover:bg-[#e4e4e4] text-white hover:text-[#101010] shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            
            <span>Buy for {formatPrice(price)} SOL</span>
          </>
        )}
      </button>

      


      {/* Success Message */}
      {/* {showSuccess && lastResult?.success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <div className="flex flex-col">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              Dataset purchased successfully!
            </p>
            {lastResult.signature && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Transaction ID: {lastResult.signature}
              </p>
            )}
          </div>
        </div>
      )} */}

      {/* Dataset Info */}
    
    </div>
  );
}

// Example usage in a dataset card or page:
/*
import DatasetPurchaseButton from '@/components/DatasetPurchase/DatasetPurchaseButton';

function DatasetCard({ dataset }) {
  const handlePurchaseSuccess = (result) => {
    // Redirect to orders page or show success modal
    router.push('/orders');
  };

  const handlePurchaseError = (error) => {
    // Show error toast or modal
    toast.error(error);
  };

  return (
    <div className="dataset-card">
      <h3>{dataset.title}</h3>
      <p>{dataset.description}</p>
      
      <DatasetPurchaseButton
        datasetId={dataset._id}
        sellerAddress={dataset.sellerAddress}
        price={dataset.price}
        datasetTitle={dataset.title}
        onPurchaseSuccess={handlePurchaseSuccess}
        onPurchaseError={handlePurchaseError}
        className="mt-4"
      />
    </div>
  );
}
*/
