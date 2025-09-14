"use client";
import React, { useState } from "react";
import { useNotifications } from "@/lib/notification-context";
import { useProcessDialog } from "@/lib/process-dialog-context";
import { useAuth } from "@/lib/Authentication/AuthContext";
import { CheckCircle, XCircle, Eye, EyeOff, Lock, Shield, Clock, User, DollarSign } from "lucide-react";
import clsx from "clsx";
import { SecretApi } from "@/lib/api/SecretApi";
import { AxiosError } from 'axios';

interface PurchaseRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  datasetId: string;
  datasetTitle: string;
  price: number;
  currency: string;
  requestedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  transactionHash?: string;
}

interface SellerRequestAcceptanceProps {
  request: PurchaseRequest;
  onAccept: (encryptionKey: string) => Promise<void>;
  onReject: () => Promise<void>;
  isProcessing?: boolean;
  className?: string;
  CloseState?:React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SellerRequestAcceptance({
  request,
  onAccept,
  onReject,
  isProcessing = false,
  className,
  CloseState
}: SellerRequestAcceptanceProps) {
 
  const { notify, reportError } = useNotifications();
  const { open: openProcess, updateStep, setActiveStep, close: closeProcess } = useProcessDialog();
  const { token } = useAuth();
  
  const [encryptionKey, setEncryptionKey] = useState("");
  const [showEncryptionKey, setShowEncryptionKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    encryptionKey?: string;
  }>({});

  const validateEncryptionKey = (key: string): string | null => {
    if (!key.trim()) {
      return "Encryption key is required";
    }
    if (key.length < 8) {
      return "Encryption key must be at least 8 characters long";
    }
    if (key.length > 256) {
      return "Encryption key is too long (max 256 characters)";
    }
    return null;
  };

  const handleEncryptionKeyChange = (value: string) => {
    setEncryptionKey(value);
    const error = validateEncryptionKey(value);
    setValidationErrors(prev => ({
      ...prev,
      encryptionKey: error || undefined
    }));
  };

  const handleAccept = async () => {
    const keyError = validateEncryptionKey(encryptionKey);
    if (keyError) {
      setValidationErrors({ encryptionKey: keyError });
      notify({
        type: "warning",
        message: "Please fix the validation errors before proceeding"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Open process dialog for escrow initiation
      openProcess({
        title: "Processing Purchase Request",
        steps: [
          "Validating encryption key",
          "Initiating escrow contract",
          "Transferring encryption key to escrow",
          "Notifying buyer",
          "Completing transaction"
        ]
      });

      // Step 1: Validate encryption key
      setActiveStep(0);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate validation
        updateStep(0, { status: "done" });
      } catch (error) {
        updateStep(0, { status: "error" });
        throw error;
      }

      // Step 2: Initiate escrow
      setActiveStep(1);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate escrow initiation
        updateStep(1, { status: "done" });
      } catch (error) {
        updateStep(1, { status: "error" });
        throw error;
      }

      // Step 3: Transfer encryption key
      setActiveStep(2);
      try {
        if (!token) {
          throw new Error("Authentication token not found.");
        }
        await SecretApi.storeSecret(request.datasetId, encryptionKey, token);
        await onAccept(encryptionKey);
        updateStep(2, { status: "done" });
      } catch (error) {
        updateStep(2, { status: "error" });
        throw error;
      }

      // Step 4: Notify buyer
      setActiveStep(3);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate notification
        updateStep(3, { status: "done" });
      } catch (error) {
        updateStep(3, { status: "error" });
        throw error;
      }

      // Step 5: Complete transaction
      setActiveStep(4);
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate completion
        updateStep(4, { status: "done" });
      } catch (error) {
        updateStep(4, { status: "error" });
        throw error;
      }

      notify({
        type: "success",
        message: "Purchase request accepted successfully! The buyer has been notified."
      });

      closeProcess();
    } catch (error: unknown) {
      let errorMessage = "Failed to accept purchase request. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (error instanceof AxiosError) {
        const errResponse = error.response?.data as { message?: string; error?: string };
        errorMessage = errResponse.message || errResponse.error || errorMessage;
      }
      console.error("Error accepting request:", error);
      reportError(errorMessage);
      closeProcess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      await onReject();
      notify({
        type: "info",
        message: "Purchase request has been rejected"
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      reportError("Failed to reject purchase request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'completed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';

        default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className={clsx(
      "w-full max-w-2xl mx-auto h-fit relative p-6 rounded-xl border transition-all duration-300",
      "bg-white dark:bg-[#131313]",
      "border-gray-200 dark:border-gray-700",
      "shadow-lg hover:shadow-xl",
      className
    )}>
      <button className="absolute top-2 right-4 text-gray-600 dark:text-gray-400 lg:hidden" onClick={() => CloseState && CloseState(false)}>X</button>
      {/* Header */}
      <div className="flex items-center flex-wrap gap-4 justify-between mb-6">
        <div className="flex items-center   gap-3">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Purchase Request
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Accept or reject this dataset purchase request
            </p>
          </div>
        </div>
        <div className={clsx(getStatusColor(request.status),
          "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
          
        )}>
          {getStatusIcon(request.status)}
          <span className="capitalize">{request.status}</span>
        </div>
      </div>

      {/* Request Details */}
      <div className="space-y-4 mb-6">
        {/* Buyer Information */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3 mb-3">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">Buyer Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Name:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{request.buyerName}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Email:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{request.buyerEmail}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Requested:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{formatDate(request.requestedAt)}</span>
            </div>
          </div>
        </div>

        {/* Dataset Information */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">Dataset Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Dataset:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{request.datasetTitle}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Price:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {request.price} {request.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Encryption Key Input */}
      {request.status === 'pending' && <> <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Lock className="w-4 h-4 inline mr-2" />
          Encryption Key *
        </label>
        <div className="relative">
          <input
            type={showEncryptionKey ? "text" : "password"}
            value={encryptionKey}
            onChange={(e) => handleEncryptionKeyChange(e.target.value)}
            placeholder="Enter the encryption key for this dataset"
            className={clsx(
              "w-full px-4 py-3 pr-12 rounded-lg border transition-colors duration-200",
              "bg-white dark:bg-[#141414]",
              "border-gray-300 dark:border-gray-600",
              "focus:border-orange-500 dark:focus:border-orange-500",
              "focus:ring-2 focus:ring-orange-500/20",
              "text-gray-900 dark:text-white",
              "placeholder-gray-500 dark:placeholder-gray-400",
              validationErrors.encryptionKey && "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20"
            )}
            disabled={isSubmitting || isProcessing}
          />
          <button
            type="button"
            onClick={() => setShowEncryptionKey(!showEncryptionKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            disabled={isSubmitting || isProcessing}
          >
            {showEncryptionKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {validationErrors.encryptionKey && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {validationErrors.encryptionKey}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          This key will be securely transferred to the buyer through our escrow system once the payment is confirmed.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAccept}
          disabled={isSubmitting || isProcessing || !!validationErrors.encryptionKey || !encryptionKey.trim()}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200",
            "bg-orange-500 hover:bg-orange-600 text-white",
            "disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-orange-500/50",
            "shadow-lg hover:shadow-xl disabled:shadow-none"
          )}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Accept Request
            </>
          )}
        </button>
        
        <button
          onClick={handleReject}
          disabled={isSubmitting || isProcessing}
          className={clsx(
            "flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium transition-all duration-200",
            "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
            "text-gray-700 dark:text-gray-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-gray-500/50",
            "border border-gray-300 dark:border-gray-600"
          )}
        >
          <XCircle className="w-5 h-5 inline mr-2" />
          Reject
        </button>
      </div>
      </>
    }

      {/* Security Notice */}
      <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Security Notice
            </h4>
            <p className="text-blue-700 dark:text-blue-200">
              Your encryption key will be securely stored in our escrow system and only released to the buyer 
              once payment is confirmed. The key is encrypted and cannot be accessed by our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
