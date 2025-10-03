"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { datasetApi } from "@/lib/api/DatasetApi";
import { useAuth } from "@/lib/Authentication/AuthContext";
export default function DatasetBlockchainPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type Dataset = {
    _id: string;
    title: string;
    blockchainSignature?: string;
    blockchainNetwork?: string;
    blockchainAccount?: string;
  } | null;
  const [dataset, setDataset] = useState<Dataset>(null);
  const {token}= useAuth();
  useEffect(() => {
    const fetchDataset = async () => {
      try {
        setLoading(true);
        const data = await datasetApi.getDatasetById(String(id),token || undefined);
        setDataset(data);
      } catch (e) {
        setError("Failed to load dataset");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDataset();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !dataset) return <div className="p-6 text-red-500">{error || 'Not found'}</div>;

  const explorer = dataset?.blockchainSignature
    ? `https://explorer.solana.com/tx/${dataset.blockchainSignature}?cluster=${dataset.blockchainNetwork || 'devnet'}`
    : null;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">On-chain Metadata</h1>
      <div className="grid gap-2 text-sm">
        <div><span className="font-medium">Dataset:</span> {dataset.title}</div>
        <div><span className="font-medium">Network:</span> {dataset.blockchainNetwork || 'devnet'}</div>
        <div><span className="font-medium">Account:</span> {dataset.blockchainAccount || '-'}</div>
        <div><span className="font-medium">Signature:</span> {dataset.blockchainSignature || '-'}</div>
        {explorer && (
          <div>
            <a href={explorer} target="_blank" className="text-orange-500 hover:underline">View on Solana Explorer</a>
          </div>
        )}
      </div>

      <div className="pt-4">
        {dataset && (
          <Link href={`/dataset/${dataset._id}`} className="text-sm text-gray-500 hover:underline">Back to dataset</Link>
        )}
      </div>
    </div>
  );
}

