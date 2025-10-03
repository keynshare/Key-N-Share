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

  return (
    <>
    <div className="flex flex-col px-3 md:px-10 xl:px-16 2xl:px-20 gap-5">
    <Breadcrumb items={[{ label: "Catalogue", href: "/catalogue" }, { label: dataset.title, isActive: true }]} />
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
