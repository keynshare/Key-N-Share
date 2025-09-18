"use client";
import React, { useState, useEffect } from "react";
import SellerRequestAcceptance from "@/components/SharedComponents/SellerRequestAcceptance";
import Breadcrumb from "@/components/SharedComponents/Breadcrumb/Breadcrumb";
import { Bell, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";

// Mock data for demonstration
type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

interface MockRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  datasetId: string;
  datasetTitle: string;
  price: number;
  currency: string;
  requestedAt: string;
  status: RequestStatus;
  transactionHash?: string;
}

const mockRequests: MockRequest[] = [
  {
    id: "req_001",
    buyerId: "buyer_123",
    buyerName: "Alice Johnson",
    buyerEmail: "alice.johnson@email.com",
    datasetId: "68baf9aed0ccd3a5909a9d08",
    datasetTitle: "Machine Learning Dataset - Customer Behavior Analysis",
    price: 25.50,
    currency: "Solana",
    requestedAt: "2024-01-15T10:30:00Z",
    status: "pending",
  },
  {
    id: "req_002",
    buyerId: "buyer_456",
    buyerName: "Bob Smith",
    buyerEmail: "bob.smith@email.com",
    datasetId: "68baf9aed0ccd3a5909a9d08",
    datasetTitle: "Financial Market Data - Q4 2023",
    price: 45.00,
    currency: "Solana",
    requestedAt: "2024-01-14T15:45:00Z",
    status: "completed",
  },
  {
    id: "req_003",
    buyerId: "buyer_789",
    buyerName: "Carol Davis",
    buyerEmail: "carol.davis@email.com",
    datasetId: "68baf9aed0ccd3a5909a9d08",
    datasetTitle: "IoT Sensor Data - Temperature Monitoring",
    price: 18.75,
    currency: "Solana",
    requestedAt: "2024-01-13T09:15:00Z",
    status: "accepted",
    transactionHash: "0x1234567890abcdef...",
  },
];

export default function SellerRequestsPage() {
 
  const [requests, setRequests] = useState<MockRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const breadcrumbItems = [

    { label: "Purchase Requests", isActive: true }
  ];

  const handleAcceptRequest = async (encryptionKey: string) => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to accept request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the request status
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest 
          ? { ...req, status: 'accepted' as const, transactionHash: '0x' + Math.random().toString(16).substr(2, 8) }
          : req
      ));
      
      // Close the selected request
      setSelectedRequest(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error accepting request:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to reject request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the request status
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest 
          ? { ...req, status: 'rejected' as const }
          : req
      ));
      
      // Close the selected request
      setSelectedRequest(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error rejecting request:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestUpdate = (updatedRequest: MockRequest) => {
    setRequests(prev => prev.map(req => 
      req.id === updatedRequest.id ? updatedRequest : req
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const selectedRequestData = selectedRequest 
    ? requests.find(req => req.id === selectedRequest)
    : null;

  return (
    
   
        <div className="min-h-screen ">
      <div className="container mx-auto px-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Purchase Requests
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage purchase requests for your datasets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Requests List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#131313] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Purchase Requests
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {requests.length} total requests
                </p>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {requests.map((request) => (
                  <button
                    key={request.id}
                    onClick={() => {
                      setSelectedRequest(request.id);
                      setIsDialogOpen(true);
                    }}
                    className={clsx(
                      "w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                      selectedRequest === request.id && "bg-orange-50 dark:bg-orange-900/20"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {request.datasetTitle}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          by {request.buyerName}
                        </p>
                      </div>
                      <div className={clsx(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(request.status)
                      )}>
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {request.price} {request.currency}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatDate(request.requestedAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="lg:col-span-2 hidden lg:block">
            {selectedRequestData ? (
              <SellerRequestAcceptance
                request={selectedRequestData}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
                isProcessing={isProcessing}
              />
            ) : (
              <div className="bg-white dark:bg-[#131313] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a Request
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a purchase request from the list to view details and take action.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog for small screens */}

     {isDialogOpen && <div className="fixed lg:hidden w-full h-screen top-0 left-0 inset-0 bg-black/50 flex  justify-center p-2 overflow-y-auto  z-[999999999999999]" >
            
      
          {selectedRequestData && (
            <SellerRequestAcceptance
              request={selectedRequestData}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
              isProcessing={isProcessing}
              CloseState={setIsDialogOpen}
             
            />
          )}
          
      
    </div>}

   </div>
  );
}
