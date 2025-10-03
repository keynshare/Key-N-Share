"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/SpecificDatasetPage/Header";
import BuyerSidebar from "./BuyerSidebar";
import { Mails } from "lucide-react";
import MetaDataSection from "./MetaDataSection";
import { useParams } from "next/navigation";
import Breadcrumb from "../SharedComponents/Breadcrumb/Breadcrumb";
import { datasetApi } from "@/lib/api/DatasetApi";
import { useAuth } from "@/lib/Authentication/AuthContext";



export default function SpecificDatasetPage() {
  const { id } = useParams(); 
  const { token } = useAuth();
  const [ShowRequest, setShowRequest] = useState(false);
  const [dataset, setDataset] = useState<{
    _id: string;
    title: string;
    description: string;
    coverImageUrl?: string;
    price: number;
    tags?: string[];
    fileSize?: string;
    averageRating?: number;
    downloads?: number;
    views?: number;
    createdAt?: string;
    extension?: string;
    schema?: string;
    source?: string;
    sellerAddress?: string;
    user?: {
      id?: string;
      name?: string;
      role?: string;
    }
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dataset by ID
  useEffect(() => {
    const fetchDataset = async () => {
      if (!id || typeof id !== 'string') {
        setError('Invalid dataset ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await datasetApi.getDatasetById(id, token || undefined);
        setDataset(response);
      } catch (err) {
        console.error('Error fetching dataset:', err);
        setError('Failed to load dataset');
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading dataset...</div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">{error || 'Dataset not found'}</div>
      </div>
    );
  }

  // Check if dataset has "test" tag
  const isTestDataset = dataset.tags?.some(tag => tag.toLowerCase() === 'test');

  return (
    <>
    <div className="flex flex-col px-3 md:px-10 xl:px-16 2xl:px-20 gap-5">
    <Breadcrumb items={[{ label: "Catalogue", href: "/catalogue" }, { label: dataset.title, isActive: true }]} />
    
    {/* Test Dataset Notification */}
    {isTestDataset && (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 p-4 rounded-md shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>Testing Dataset Notice:</strong> This dataset is uploaded for testing purposes only. We do not claim ownership of this data and it should not be used for production purposes.
            </p>
          </div>
        </div>
      </div>
    )}
    
    <div className=" grid grid-cols-4  gap-1  pb-8 ">
      <div className="col-span-full lg:col-span-3 lg:pr-5 xl:pr-10">
        <Header 
          id={dataset._id}
          Rating={dataset.averageRating}
          Time={dataset.createdAt}
          Size={dataset.fileSize}
          Title={dataset.title} 
          Extention={dataset.extension || 'UNKNOWN'} 
          Price={dataset.price} 
          Tags={dataset.tags || []} 
          CoverImage={dataset.coverImageUrl || 'https://via.placeholder.com/800x400?text=No+Image'}
          sellerAddress={dataset.sellerAddress}
          Name={dataset.user?.name || 'Unknown Author'}
          userId={dataset?.user?.id || ''}
         
        />
        <MetaDataSection
          About={dataset.description}
          Source={dataset.source}
          Schema={dataset.schema}
          datasetId={dataset._id}
        />
      </div>

      <BuyerSidebar ShowRequest={ShowRequest} UploaderId={dataset.sellerAddress} datasetId={dataset._id} />

      <button
        onClick={() => setShowRequest(!ShowRequest)}
        className="fixed text-white lg:hidden bottom-10 right-8 bg-orange-400 p-4 rounded-full z-50"
      >
        <Mails />
      </button>
    </div>
    </div>
    </>
  );
}
