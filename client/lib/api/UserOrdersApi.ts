"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";

export interface CreateOrderRequest {
  buyerId: string;
  buyerAddress: string;
  datasetId: string;
  txnSign: string;
}

export interface DatasetSummary {
  _id: string;
  title: string;
  price: number;
  downloads?: number;
  views?: number;
  imageUrl?: string;
}

export interface UserOrder {
  _id: string;
  buyerId: string;
  buyerAddress: string;
  datasetId: string;
  txnSign: string;
  createdAt: string;
  updatedAt: string;
  dataset: DatasetSummary;
}

export interface CreateOrderResponse {
  message: string;
  order: UserOrder;
}

export interface ListOrdersResponse {
  page: number;
  limit: number;
  total: number;
  orders: UserOrder[];
}

export const userOrdersApi = {
  createOrder: async (payload: CreateOrderRequest, token?: string): Promise<CreateOrderResponse> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await axios.post(`${API_URL}userOrders/`, payload, { headers });
    return response.data;
  },

  listOrders: async (params: { userId: string; page?: number; limit?: number }, token?: string): Promise<ListOrdersResponse> => {
    const { userId, page = 1, limit = 20 } = params;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await axios.get(
      `${API_URL}userOrders/orders/`,
      { headers, data: { userId, page, limit } }
    );
    return response.data;
  },

  getOrderById: async (id: string, token?: string): Promise<{ order: UserOrder }> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await axios.get(`${API_URL}userOrders/${id}`, { headers });
    return response.data;
  },
};


