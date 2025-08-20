"use client";
import React, { useState } from "react";
import FilterSidebar from "@/components/SharedComponents/Filter/FilterSidebar";
import DatasetCard from "../SharedComponents/DatasetCompo/DatasetCard";
import { Search, Filter } from "lucide-react";
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";

function Dashboard() {
  const categories = ["Trending", "Highest Rating", "Newly Added"];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-4  pb-20 px-3 md:px-10 xl:px-20 gap-5">
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
              <Search size={20} className="text-gray-500" />
            </PrimaryBtn>
          </div>

          {/* Categories */}
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col overflow-x-auto overflow-visible w-full h-fit gap-5 items-start justify-start"
            >
              <h2 className="text-[25px] font-semibold font-bricola ">
                {category}
              </h2>
              <div className="flex  h-fit w-full  justify-between gap-4 items-center">
                <DatasetCard />
                <DatasetCard />
                <DatasetCard />
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-5 items-center justify-center ">
            <h1 className="sm:font-semibold text-lg sm:text-3xl md:text-[31px] lg:text-[42px] xl:text-5xl text-center font-bricola ">
              Didn't come across what you were expecting?
            </h1>
            <SecondaryBtn Href="/Catalogue">Discover All Datasets</SecondaryBtn>
          </div>
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
        className={`fixed top-0 left-0 h-full  bg-white shadow-lg overflow-y-auto z-20 pt-20 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
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

export default Dashboard;
