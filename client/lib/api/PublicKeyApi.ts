"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";

export interface AddPublicKeyRequest {
  userId: string;
  publicKey: string;
}

export interface AddPublicKeyResponse {
  message: string;
}

export interface GetPublicKeyResponse {
  userId: string;
  publicKeyPEM: string;
}

export const publicKeyApi = {
  addPublicKey: async (
    payload: AddPublicKeyRequest,
    token?: string
  ): Promise<AddPublicKeyResponse> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await axios.post(`${API_URL}user/addPublicKey`, payload, { headers });
    return response.data;
  },

  getPublicKey: async (token?: string): Promise<GetPublicKeyResponse> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await axios.get(`${API_URL}user/publicKey`, { headers });
    return response.data;
  },
};
