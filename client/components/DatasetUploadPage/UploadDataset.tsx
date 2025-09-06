"use client"
import React, { useState } from "react";
import { AxiosError } from "axios";
import FileUpload from "./FileUpload";
import DatasetDetailsForm from "./DatasetDetailsForm";
import SecurityDetailsForm from "./SecurityDetailsForm";
import { useAuth } from "@/lib/Authentication/AuthContext";
import { useNotifications } from "@/lib/notification-context";
import {useWalletConnection} from "@/lib/Authentication/walletConnection";
import { useProcessDialog } from "@/lib/process-dialog-context";
import Breadcrumb from "../SharedComponents/Breadcrumb/Breadcrumb";
export interface DatasetFormData {
  title: string;
  source: string;
  price: string;
  category: string;
  schema: string;
  extension: string;
  description: string;
  termsAccepted: boolean;
  encryptionKey: string;
  securityTermsAccepted: boolean;
  file: File | null;
  coverImage: File | null;
  tags: string[];
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
    extension: "",
    description: "",
    termsAccepted: false,
    encryptionKey: "",
    securityTermsAccepted: false,
    file: null,
    coverImage: null,
    tags: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const { token, userId } = useAuth();
  const { notify } = useNotifications();
  const { open: openProcess, setActiveStep, updateStep, close: closeProcess } = useProcessDialog();

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

    if (!formData.title || !formData.description || !formData.price || formData.tags.length === 0) {
      notify({ type: "error", message: "Please fill in all required fields including at least one category/tag" });
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
if (!formData.encryptionKey) {
  notify({ type: "error", message: "Please Choose an Encryption Key" });
  setIsUploading(false);
  return;
}

    setIsUploading(true);
    try {
      openProcess({
        title: "Uploading dataset",
        steps: [
          "Encrypting file",
          "Uploading to IPFS",
          "Generating hash",
          "Adding to catalogue",
        ],
      });
      // Import the dataset API
      const { datasetApi } = await import("@/lib/api/DatasetApi");
      
      // Encrypt dataset file before uploading
      setActiveStep(0);
      const encryptedFile = await datasetApi.encryptFileAES256(formData.file, formData.encryptionKey);
      updateStep(0, { status: "done" });

      // Upload file to IPFS
      setActiveStep(1);
      const uploadResponse = await datasetApi.uploadFile(encryptedFile, token);
      updateStep(1, { status: "done" });

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
     setActiveStep(2);
      const originalContentHash = await datasetApi.generateSHA256(formData.file);
      updateStep(2, { status: "done" });

      const FileType = formData.file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN'
      // Add dataset to catalogue
      setActiveStep(3);
      const catalogueData = {
         userId, 
        sellerAddress: address,
        source:formData.source,
        title: formData.title,
        extension:FileType ,
        price: parseFloat(formData.price),
        dataCID: uploadResponse.data.cid,
        originalContentHash: originalContentHash,
        description: formData.description,
        coverImageUrl: coverImageUrl, 
        tags: formData.tags,
        fileSize: formatFileSize(formData.file.size),
        schema:formData.schema
      };

      const catalogueResponse = await datasetApi.addDatasetToCatalogue(catalogueData, token);
      updateStep(3, { status: "done" });
      
      notify({ type: "success", message: "Dataset uploaded successfully!" });
      closeProcess();
      
      // Reset form
      setFormData({
        title: "",
        source: "",
        price: "",
        category: "",
        schema: "",
        extension: "",
        description: "",
        termsAccepted: false,
        encryptionKey: "",
        securityTermsAccepted: false,
        file: null,
        coverImage: null,
        tags: []
      });
      
    } catch (error: unknown) {
      console.error("Upload error:", error);
      updateStep(0, { status: "error" });
      updateStep(1, { status: "error" });
      updateStep(2, { status: "error" });
      updateStep(3, { status: "error" });

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
      closeProcess();
    }
  };

  const breadcrumbItems = [
    { label: "Catalogue" },
    { label: "Upload Datasets", isActive: true }
  ]; 
  return (
    <>
    <div className=" w-full pl-10 xl:pl-16 mb-5">
    <Breadcrumb items={breadcrumbItems}/>
    </div>
    <div className="flex flex-col items-center px-3 md:px-10 xl:px-16  pb-16  ">
      
      <div className="w-full  rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
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
        <div className="flex flex-col lg:flex-row p-6 gap-6">
          {/* File Dropzone */}
          <div className=" lg:w-1/2">
            <FileUpload 
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
          </div>

          {/* Forms */}
          <div className="lg:w-1/2">
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
    </>
  );
}

export default UploadDataset;
