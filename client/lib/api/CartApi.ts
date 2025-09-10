"use client";

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  extension: string;
  description: string;
  coverImageUrl?: string;
  tags?: string[];
  fileSize: string;
  sellerAddress: string;
}

export interface CartResponse {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export const cartApi = {
  // Get user's cart
  getCart: async (token: string, userId?: string): Promise<CartResponse> => {
    const response = await axios.get(`${API_URL}cart/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Add item to cart
  addToCart: async (datasetId: string, token: string) => {
    const response = await axios.put(`${API_URL}cart/add`, 
      { datasetId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (datasetId: string, token: string) => {
    const response = await axios.delete(`${API_URL}cart/delete/${datasetId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
};