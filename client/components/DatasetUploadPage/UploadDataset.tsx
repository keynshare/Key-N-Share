"use client"
import React, { useState } from "react";
import PrimaryBtn from "@/components/SharedComponents/Btns/PrimaryBtn"
import CoverUpload from "./CoverUpload";
import DatasetDetailsForm from "./DatasetDetailsForm";
import SecurityDetailsForm from "./SecurityDetailsForm";

function UploadDataset() {
  const [activeTab, setActiveTab] = useState("dataset");

  return (
    <div className="flex flex-col items-center min-h-screen  md:p-6">
      <div className="w-full max-w-5xl rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-semibold ">Upload Dataset</h1>
          
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-gray-700 space-x-6 px-6 mt-2">
          {["dataset", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-sm translate-y-[1px] font-medium ${
                activeTab === tab
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-400"
              }`}
            >
              {tab === "dataset" ? "Dataset Details" : "Security Details"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex p-6 gap-6">
          {/* Left: Dropzone */}
          <div className="w-1/2">
            <CoverUpload />
          </div>

          {/* Right: Form */}
          <div className="w-1/2">
            {activeTab === "dataset" ? (
              <DatasetDetailsForm />
            ) : (
              <SecurityDetailsForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadDataset;
