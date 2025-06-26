// src/services/customerService.js
import api from './api';

const getCustomers = async (limit = 100) => {
  try {
    // Debug log to verify the full URL
    console.log('Full API URL:', `${process.env.REACT_APP_API_URL}/user/list?limit=${limit}`);
    
    const response = await api.get(`/user/list?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const customerService = {
  getCustomers
};