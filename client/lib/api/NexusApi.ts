"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";

export interface NexusRequest {
  userInput: string;
}

export interface NexusResponse {
  output: string;
}

export interface NexusError {
  error: string;
}

export const nexusApi = {
  sendMessage: async (userInput: string): Promise<string> => {
    const response = await axios.post<NexusResponse>(`${API_URL}nexus`, {
      userInput
    });
    
    return response.data.output;
  },
};
