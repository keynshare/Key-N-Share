"use client";
import React, { useState,useEffect } from "react";
import FilterSidebar from "@/components/SharedComponents/Filter/FilterSidebar";
import { Search, Filter } from "lucide-react";
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";
import Breadcrumb from "@/components/SharedComponents/Breadcrumb/Breadcrumb";
import DatasetData from '@/components/assets/dataset.json'
import CardsWithCategory from "./CardsWithCategory";




function Dashboard() {
 
  const [isOpen, setIsOpen] = useState(false);
  
 
const categories = ["Trending", "Highest Rating", "Newly Added"];


  return (
    <>
      <Breadcrumb isHome={true}  className="mb-5 pl-10 xl:pl-16" />

      <div className="grid grid-cols-4 pb-20 px-3 md:px-10 xl:px-16 gap-5">
        <div className="hidden sticky top-0 grid-cols-1 h-fit w-fit xl:block">
          <FilterSidebar />
        </div>

        <div className="flex flex-col col-span-full xl:col-span-3 gap-10 items-start justify-start">
          <div className="flex items-center w-full border overflow-hidden dark:border-gray-600 h-fit focus-within:border-orange-500 dark:focus-within:border-orange-500 rounded-lg ">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none !border-none text-lg w-full px-4 py-2 bg-transparent"
            />
            <PrimaryBtn
              className="!rounded-none h-full"
              sparkelClass="hidden"
            >
              <Search size={20}  />
            </PrimaryBtn>
          </div>

         <CardsWithCategory categories={categories} Data={DatasetData} />

          <div className="flex flex-col gap-5 items-center justify-center w-full pt-10">
            <h1 className="sm:font-semibold text-lg sm:text-3xl md:text-[31px] lg:text-[42px] xl:text-5xl text-center font-bricola ">
              Didn&apos;t come across what you were expecting?
            </h1>
            <SecondaryBtn Href="/Catalogue">Discover All Datasets</SecondaryBtn>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="xl:hidden z-50 fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg"
      >
        <Filter size={24} />
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-[#131313] shadow-lg overflow-y-auto z-20 pt-20 transform transition-transform duration-300 ${
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

export default Dashboard;
