"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";

export interface LedgerEntry {
  buyerAddress: string;
  sellerAddress: string;
  dataset: {
    id: string;
    name: string;
    cost: number;
    cid: string;
    hash: string;
  };
  txnSign: string;
  createdAt: string;
}

export interface LedgerResponse {
  page: number;
  limit: number;
  total: number;
  entries: LedgerEntry[];
}

export interface LedgerParams {
  page?: number;
  limit?: number;
}

export const ledgerApi = {
  getLedger: async (params: LedgerParams = {}): Promise<LedgerResponse> => {
    const { page = 1, limit = 50 } = params;
    
    const response = await axios.get(`${API_URL}ledger`, {
      params: { page, limit }
    });
    
    return response.data;
  },
};
