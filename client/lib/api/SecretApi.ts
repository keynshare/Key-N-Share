import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SecretApi = {
  storeSecret: async (identifier: string, secret: string, token: string) => {
    try {
      const response = await axios.post(`${API_URL}secrets/addSecret`, { identifier, secret }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error storing secret:', error);
      throw error;
    }
  },
  getSecret: async (identifier: string) => {
    try {
      const response = await axios.get(`${API_URL}secrets/getSecret/${identifier}`);
      return response.data;
    } catch (error) {
      console.error('Error retrieving secret:', error);
      throw error;
    }
  },
  deleteSecret: async (identifier: string) => {
    try {
      const response = await axios.delete(`${API_URL}secrets/deleteSecret/${identifier}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting secret:', error);
      throw error;
    }
  },
};