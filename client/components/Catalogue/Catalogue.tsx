"use client";
import React, { useState, useEffect } from "react";
import FilterSidebar from "@/components/SharedComponents/Filter/FilterSidebar";
import DatasetCard from "../SharedComponents/DatasetCompo/DatasetCard";
import { Search, Filter } from "lucide-react";
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import Pagination from "../SharedComponents/Pagination/Pagination";
import Breadcrumb from "@/components/SharedComponents/Breadcrumb/Breadcrumb";
import DatasetCardSkeleton from "../Skeletons/Dataset/DatasetCardSkeleton";
import PaginationSkeleton from "../Skeletons/Dataset/PaginationSkeleton";
import { datasetApi } from "@/lib/api/DatasetApi";
import { useAuth } from "@/lib/Authentication/AuthContext";
function Catalogue() {
  const [isOpen, setIsOpen] = useState(false);
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
    downloads?: number;
    views?: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuth();

  const itemsPerPage = 12;

  // Fetch datasets from API
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true);
        const response = await datasetApi.getDatasets(currentPage, itemsPerPage, token || undefined);
        setDatasets(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error('Error fetching datasets:', err);
        setError('Failed to load datasets');
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, [currentPage, token]);
  const breadcrumbItems = [
    { label: "Catalogue", isActive: true }
  ]; 

  return (
    <>
      {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} className="mb-5 pl-10 xl:pl-16" />
      <div className="grid grid-cols-4  pb-20 px-3 md:px-10 xl:px-16  gap-5">
        {/* Sidebar for xl and up */}
        <div className="hidden sticky top-0 grid-cols-1 h-fit w-fit xl:block">
          <FilterSidebar />
        </div>

        {/* Content */}
        <div className="flex flex-col col-span-full xl:col-span-3 gap-10 items-start justify-start">
          
          {/* Search bar */}
          <div className="flex items-center w-full border overflow-hidden dark:border-gray-600 h-fit focus-within:border-orange-500 dark:focus-within:border-orange-500 rounded-lg ">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none !border-none text-lg px-4 py-2 "
            />
            <PrimaryBtn
              classInner="!rounded-none h-full "
              classsecondInner="rounded-l-none"
              className="h-full "
              sparkelClass="hidden"
            >
              <Search size={20}  />
            </PrimaryBtn>
          </div>

          {/* Categories */}
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
          ) : (
            <div className="flex flex-wrap w-full h-fit gap-5 justify-center items-start">
              {datasets.map((dataset, index) => (
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
      </div>


      {/* Floating Filter Button  */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="xl:hidden z-50 fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg"
      >
        <Filter size={24} />
      </button>


      {/* Mobile Sidebar Drawer */}
      
      <div
        className={`fixed top-0 left-0 h-full  bg-white dark:bg-[#131313] shadow-lg overflow-y-auto z-20 pt-20 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
          <h2 className="font-bold text-lg">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>
        <FilterSidebar />
      </div>
    </>
  );
}

export default Catalogue
