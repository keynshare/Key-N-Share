"use client";
import React, { useState, useEffect } from "react";
import DatasetCard from "../SharedComponents/DatasetCompo/DatasetCard";
import { Search } from "lucide-react";
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import DatasetCardSkeleton from "../Skeletons/Dataset/DatasetCardSkeleton";
import Pagination from "../SharedComponents/Pagination/Pagination";
import PaginationSkeleton from "../Skeletons/Dataset/PaginationSkeleton";
import { datasetApi } from "@/lib/api/DatasetApi";
import { useAuth } from "@/lib/Authentication/AuthContext";

interface UserDatasetsProps {
  userId?: string;
}

function UserDatasets({ userId }: UserDatasetsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [datasets, setDatasets] = useState<Array<{
    _id: string;
    title: string;
    description: string;
    coverImageUrl?: string;
    price: number;
    tags?: string[];
    fileSize?: string;
    averageRating?: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const { token, userId: authUserId } = useAuth();
  
  // Use prop userId if provided, otherwise use auth userId
  const currentUserId = userId || authUserId;
  
  const itemsPerPage = 12;

  // Fetch datasets from API
  useEffect(() => {
    const fetchDatasets = async () => {
      if (!currentUserId) {
        console.log('No userId available for UserDatasets component');
        return;
      }
      
      try {
        setLoading(true);
        const response = await datasetApi.getDatasetByUser(currentUserId, currentPage, itemsPerPage, token || undefined);
        setDatasets(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error('Error fetching user datasets:', err);
        setError('Failed to load datasets');
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, [currentUserId, currentPage, token]);

  // Filter datasets based on search query
  const filteredDatasets = datasets.filter(dataset =>
    dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dataset.tags && dataset.tags.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">My Datasets</h2>
      
      {/* Search bar */}
      <div className="flex items-center w-full border overflow-hidden dark:border-gray-600 h-fit focus-within:border-orange-500 dark:focus-within:border-orange-500 rounded-lg mb-6">
        <input
          type="text"
          placeholder="Search your datasets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 outline-none !border-none text-lg px-4 py-2"
        />
        <PrimaryBtn
          classInner="!rounded-none h-full"
          classsecondInner="rounded-l-none"
          className="h-full"
          sparkelClass="hidden"
        >
          <Search size={20} />
        </PrimaryBtn>
      </div>

      {/* Datasets Grid */}
      {loading ? (
        <div className="flex flex-wrap w-full h-fit gap-5 justify-center items-start">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <DatasetCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-10">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      ) : filteredDatasets.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-10">
          <div className="text-lg text-gray-500 mb-2">
            {searchQuery ? 'No datasets match your search.' : 'No datasets found.'}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-orange-500 hover:text-orange-600 underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap w-full h-fit gap-5 justify-center items-start">
          {filteredDatasets.map((dataset, index) => (
            <DatasetCard key={dataset._id || index} Data={dataset} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {loading ? (
        <PaginationSkeleton />
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default UserDatasets;
