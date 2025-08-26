"use client";
import React, { useState } from "react";
import FilterSidebar from "@/components/SharedComponents/Filter/FilterSidebar";
import DatasetCard from "../SharedComponents/DatasetCompo/DatasetCard";
import { Search, Filter } from "lucide-react";
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import Pagination from "../SharedComponents/Pagination/Pagination";
import Breadcrumb from "@/components/SharedComponents/Breadcrumb/Breadcrumb";
import DatasetData from '@/components/assets/dataset.json'
function Catalogue() {
  const categories = ["Trending", "Highest Rating", "Newly Added"];
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

   const itemsPerPage = 12; 
  const totalItems = DatasetData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = DatasetData.slice(startIndex, endIndex);
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
            <div
             
              className="flex flex-wrap w-full h-fit gap-5 justify-center items-start "
            >
          {DatasetData.map((category, index) => (
          
                <DatasetCard key={index} Data={category} />
              
           
          ))}
           </div>

          {/* Pagination */}
          <Pagination
             currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

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
