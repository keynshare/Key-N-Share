"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";

export interface SubmitRatingRequest {
  datasetId?: string;
  userId?: string;
  rating: number;
  comment?: string;
  ratingType: 'dataset' | 'seller' | 'buyer';
  orderId?: string;
}

export interface RatingResponse {
  message: string;
  rating: {
    _id: string;
    datasetId?: string;
    userId?: string;
    raterId: string;
    rating: number;
    comment?: string;
    ratingType: string;
    orderId?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  raterIds?: string[];
}

export const ratingApi = {
  submitRating: async (payload: SubmitRatingRequest, token: string): Promise<RatingResponse> => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(`${API_URL}ratings`, payload, { headers });
    return response.data;
  },

  getDatasetRatingSummary: async (datasetId: string, token: string): Promise<RatingSummary> => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(`${API_URL}datasets/${datasetId}/rating-summary`, { headers });
    return response.data;
  },
  getDatasetRating: async (datasetId: string, token: string): Promise<RatingSummary> => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(`${API_URL}datasets/${datasetId}/rating-summary`, { headers });
    return response.data;
  },

  getUserRatingSummary: async (userId: string, ratingType: 'seller' | 'buyer' = 'seller',token: string): Promise<RatingSummary> => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(`${API_URL}users/${userId}/rating-summary`, {
      params: { ratingType },
      headers
    });
    return response.data;
  },
};
