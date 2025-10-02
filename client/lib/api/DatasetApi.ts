"use client";

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';

export interface DatasetUploadResponse {
  success: boolean;
  message: string;
  data: {
    cid: string;
    size: number;
    filename: string;
    mimetype: string;
    timestamp: string;
    urls: {
      gateway: string;
      ipfs: string;
      cloudflare: string;
    };
  };
}

export interface DatasetCatalogueData {
  userId: string ;
  sellerAddress: string;
  title: string;
  price: number;
  source: string;
  extension: string;
  dataCID: string;
  originalContentHash: string;
  description: string;
  coverImageUrl?: string;
  tags?: string[];
  fileSize: string;
  averageRating?: number;
  createdAt?: string;
  schema: string;
  blockchainTxSignature?: string;
  blockchainAccount?: string;
}

export const datasetApi = {
  // Upload file to IPFS
  uploadFile: async (file: File, token: string): Promise<DatasetUploadResponse> => {
    const formData = new FormData();
    formData.append('dataset', file);

    const response = await axios.post(`${API_URL}datasets/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Add dataset to catalogue
  addDatasetToCatalogue: async (datasetData: DatasetCatalogueData, token: string) => {
    const response = await axios.post(`${API_URL}dataset-catalogue`, datasetData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Get dataset by CID
  getDatasetByCID: async (cid: string, token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_URL}datasets/${cid}`, { headers });
    return response.data;
  },

  // Get all datasets with pagination
  getDatasets: async (page = 1, limit = 12, token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.get(
      `${API_URL}dataset-catalogue?page=${page}&limit=${limit}`,
      { headers }
    );
    return response.data;
  },

  // Get dataset by ID
  getDatasetById: async (id: string, token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_URL}dataset-catalogue/${id}`, { headers });
    return response.data;
  },

  // Get datasets by user ID with pagination
  getDatasetByUser: async (userId: string, page = 1, limit = 10, token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.get(
      `${API_URL}dataset-catalogue/user/${userId}?page=${page}&limit=${limit}`,
      { headers }
    );
    return response.data;
  },

  generateSHA256: async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  },


  encryptFileAES256: async (file: File, password: string): Promise<File> => {
    const enc = new TextEncoder();

  // Derive a 256-bit key from the password using PBKDF2
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  // Read file into ArrayBuffer
  const fileBuffer = await file.arrayBuffer();

  // AES-GCM requires a random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt file contents
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    fileBuffer
  );

  // Bundle salt + iv + ciphertext together
  const encryptedBytes = new Uint8Array(
    salt.byteLength + iv.byteLength + encrypted.byteLength
  );
  encryptedBytes.set(salt, 0);
  encryptedBytes.set(iv, salt.byteLength);
  encryptedBytes.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

  // Return as File object
  return new File([encryptedBytes], file.name + ".enc", {
    type: "application/octet-stream",
  });
}


};
