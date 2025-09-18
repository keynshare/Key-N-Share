"use client";

import React, { useState, useEffect } from "react";
import { ledgerApi, LedgerEntry } from "@/lib/api/LedgerApi";
import { ExternalLink, Copy, Calendar, DollarSign, Hash, User, Package, Loader2, AlertCircle } from "lucide-react";
import Breadcrumb from "@/components/SharedComponents/Breadcrumb/Breadcrumb";
import { useNotifications } from "@/lib/notification-context";
import Pagination from "@/components/SharedComponents/Pagination/Pagination";

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const { notify } = useNotifications();

  const itemsPerPage = 20;

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ledgerApi.getLedger({ 
          page: currentPage, 
          limit: itemsPerPage 
        });
        
        setEntries(response.entries);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
        setTotalEntries(response.total);
      } catch (err) {
        console.error('Error fetching ledger:', err);
        setError('Failed to load ledger entries');
        notify({ 
          message: 'Failed to load ledger entries', 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [currentPage, notify]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify({ 
        message: `${label} copied to clipboard`, 
        type: 'success' 
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      notify({ 
        message: 'Failed to copy to clipboard', 
        type: 'error' 
      });
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTransactionHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Ledger", isActive: true }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-8 flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-gray-600 dark:text-gray-400">Loading ledger entries...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-8 flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Error Loading Ledger</h2>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="mt-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-bricola">
            Transaction Ledger
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            View all dataset transactions on the blockchain
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              {totalEntries} total transactions
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {/* Ledger Entries */}
        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Transactions Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                There are no transactions in the ledger yet.
              </p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div
                key={`${entry.txnSign}-${index}`}
                className="bg-white dark:bg-[#131313] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 title={entry.dataset.name} className="text-lg line-clamp-1 max-w-[200px] truncate md:max-w-[498px] lg:max-w-[800px]   font-semibold text-gray-900 dark:text-white">
                          {entry.dataset.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">
                        {entry.dataset.cost} SOL
                      </p>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Buyer Address */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Buyer Address
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <code title={entry.buyerAddress} className="text-sm font-mono text-gray-900 dark:text-white flex-1">
                          {formatAddress(entry.buyerAddress)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(entry.buyerAddress, 'Buyer address')}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Seller Address */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Seller Address
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <code title={entry.sellerAddress} className="text-sm font-mono text-gray-900 dark:text-white flex-1">
                          {formatAddress(entry.sellerAddress)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(entry.sellerAddress, 'Seller address')}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Hash */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Transaction Hash
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <code title={entry.txnSign} className="text-sm font-mono text-gray-900 dark:text-white flex-1">
                        {formatTransactionHash(entry.txnSign)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(entry.txnSign, 'Transaction hash')}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => window.open(`https://explorer.solana.com/tx/${entry.txnSign}`, '_blank')}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        title="View on Solana Explorer"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Dataset Details */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Dataset ID
                        </label>
                        <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">
                          {entry.dataset.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          IPFS CID
                        </label>
                        <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">
                          {entry.dataset.cid.slice(0, 20)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
