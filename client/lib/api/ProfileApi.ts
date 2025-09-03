"use client";

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

export const profileApi = {
  getCurrentUserProfile: async (token: string) => {
    const response = await axios.get(`${API_URL}profile/me/profile`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  getUserProfile: async (userId: string, token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_URL}profile/${userId}`, { headers });
    return response.data;
  },
  
  updateUserProfile: async (updates: { role?: string; bio?: string }, token: string) => {
    const response = await axios.put(`${API_URL}profile/me/profile`, updates, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  incrementProfileViews: async (userId: string, token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.post(`${API_URL}profile/${userId}/view`, {}, { headers });
    return response.data;
  },
  
  getUserDatasets: async (userId: string, page = 1, limit = 10, token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.get(
      `${API_URL}profile/${userId}/datasets?page=${page}&limit=${limit}`,
      { headers }
    );
    return response.data;
  },
  
  getUserStatistics: async (token: string) => {
    const response = await axios.get(`${API_URL}profile/me/statistics`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
};
