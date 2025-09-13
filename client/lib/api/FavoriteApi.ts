"use client";

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';

export interface FavoriteItem {
  _id: string;
  title: string;
  price: number;
  extension: string;
  description: string;
  coverImageUrl?: string;
  tags?: string[];
  fileSize: string;
  sellerAddress: string;
  averageRating: number;
  createdAt: string;
}

export interface FavoriteResponse {
  _id: string;
  userId: string;
  items: FavoriteItem[];
  createdAt: string;
  updatedAt: string;
}

export const favoriteApi = {
  // Get user's favorites
  getFavorites: async (token: string, userId?: string): Promise<FavoriteResponse> => {
    const response = await axios.get(`${API_URL}favorites/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Add item to favorites
  addToFavorites: async (datasetId: string, token: string) => {
    const response = await axios.put(`${API_URL}favorites/add`, 
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

  // Remove item from favorites
  removeFromFavorites: async (datasetId: string, token: string) => {
    const response = await axios.delete(`${API_URL}favorites/delete/${datasetId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
};