"use client"
import React, { useState } from "react";
import { AxiosError } from "axios";
import FileUpload from "./FileUpload";
import DatasetDetailsForm from "./DatasetDetailsForm";
import SecurityDetailsForm from "./SecurityDetailsForm";
import { useAuth } from "@/lib/Authentication/AuthContext";
import { useNotifications } from "@/lib/notification-context";
import {useWalletConnection} from "@/lib/Authentication/walletConnection";
export interface DatasetFormData {
  title: string;
  source: string;
  price: string;
  category: string;
  schema: string;
  description: string;
  termsAccepted: boolean;
  encryptionKey: string;
  securityTermsAccepted: boolean;
  file: File | null;
  coverImage: File | null;
}


//File size formatter
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};


function UploadDataset() {
  const { address } = useWalletConnection();
  const [activeTab, setActiveTab] = useState("dataset");
  const [formData, setFormData] = useState<DatasetFormData>({
    title: "",
    source: "",
    price: "",
    category: "",
    schema: "",
    description: "",
    termsAccepted: false,
    encryptionKey: "",
    securityTermsAccepted: false,
    file: null,
    coverImage: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const { token, userId } = useAuth();
  const { notify } = useNotifications();

  const handleFormDataChange = (updates: Partial<DatasetFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleUpload = async () => {
    if (!token) {
      notify({ type: "error", message: "Please log in to upload datasets" });
      return;
    }

    if (!formData.file) {
      notify({ type: "error", message: "Please select a dataset file" });
      return;
    }

    if (!formData.coverImage) {
      notify({ type: "error", message: "Please select a cover image" });
      return;
    }

    // Validate cover image size (limit to 5MB)
    const MAX_COVER_MB = 5;
    if (formData.coverImage.size > MAX_COVER_MB * 1024 * 1024) {
      notify({ type: "error", message: `Cover image is too large. Max ${MAX_COVER_MB} MB.` });
      return;
    }

    if (!formData.termsAccepted || !formData.securityTermsAccepted) {
      notify({ type: "error", message: "Please accept the terms and conditions" });
      return;
    }

    if (!formData.title || !formData.description || !formData.price) {
      notify({ type: "error", message: "Please fill in all required fields" });
      return;
    }
    if (!userId) {
  notify({ type: "error", message: "Session Expired. Please log in again." });
  setIsUploading(false);
  return;
}

if (!address) {
  notify({ type: "error", message: "Please connect your wallet." });
  setIsUploading(false);
  return;
}

    setIsUploading(true);
    try {
      // Import the dataset API
      const { datasetApi } = await import("@/lib/api/DatasetApi");
      
      // Encrypt dataset file before uploading
      notify({ type: "info", message: "Encrypting File..." });
      const encryptedFile = await datasetApi.encryptFileAES256(formData.file, formData.encryptionKey);

      // Upload file to IPFS
      notify({ type: "info", message: "Uploading file to IPFS..." });
      const uploadResponse = await datasetApi.uploadFile(encryptedFile, token);
      notify({ type: "success", message: "File uploaded to IPFS successfully!" });

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message);
      }

      // Convert cover image to base64 data URL for MongoDB storage
      const coverImageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.onerror = () => reject(new Error('Failed to read cover image'));
        if (formData.coverImage) {
          reader.readAsDataURL(formData.coverImage);
        } else {
          resolve('');
        }
      });

     //Generate SHA256 Hash
     notify({ type: "info", message: "Generating Hash of the File..." });
      const originalContentHash = await datasetApi.generateSHA256(formData.file);

      // Add dataset to catalogue
      notify({ type: "info", message: "Adding dataset to catalogue..." });
      const catalogueData = {
         userId, 
        sellerAddress: address,
        title: formData.title,
        price: parseFloat(formData.price),
        dataCID: uploadResponse.data.cid,
        originalContentHash: originalContentHash,
        description: formData.description,
        coverImageUrl: coverImageUrl, 
        tags: formData.category ? [formData.category] : [],
        fileSize: formatFileSize(formData.file.size)
      };

      const catalogueResponse = await datasetApi.addDatasetToCatalogue(catalogueData, token);
      
      notify({ type: "success", message: "Dataset uploaded successfully!" });
      
      // Reset form
      setFormData({
        title: "",
        source: "",
        price: "",
        category: "",
        schema: "",
        description: "",
        termsAccepted: false,
        encryptionKey: "",
        securityTermsAccepted: false,
        file: null,
        coverImage: null
      });
      
    } catch (error: unknown) {
      console.error("Upload error:", error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 413) {
          notify({ type: "error", message: "Cover image is too large. Reduce size and try again." });
        } else {
          notify({ type: "error", message: error.response?.data.message || "Failed to upload dataset" });
        }
      } else {
        notify({ type: "error", message: "Failed to upload dataset" });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center   md:p-6">
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
          {/* File Dropzone */}
          <div className="w-1/2">
            <FileUpload 
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
          </div>

          {/* Forms */}
          <div className="w-1/2">
            {activeTab === "dataset" ? (
              <DatasetDetailsForm 
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onUpload={handleUpload}
                isUploading={isUploading}
              />
            ) : (
              <SecurityDetailsForm 
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onUpload={handleUpload}
                isUploading={isUploading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadDataset;
