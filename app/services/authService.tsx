import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Sesuaikan dengan endpoint API Anda

interface Credentials {
  username: string;
  password: string;
}

const login = async (credentials: Credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);

    if (response.data.token) {
      // Simpan token dan data user di localStorage
      // Ensure localStorage is available before setting items
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        console.warn("localStorage not available to save user data.");
      }
    }

    return response.data.token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error: throw response data or generic message
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      // Standard JavaScript error
      throw error.message;
    } else {
      // Other types of errors
      throw error;
    }
  }
};

const logout = () => {
  // Ensure localStorage is available before removing items
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('user');
  }
};

const getCurrentUser = () => {
  // Check if localStorage is available (i.e., running in a browser environment)
  if (typeof window !== 'undefined' && window.localStorage) {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }
  // If localStorage is not available (e.g., server-side rendering), return null.
  return null;
};

const getAuthHeader = () => {
  const user = getCurrentUser(); // This call is now safe in server environments
  
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
};

export const authService = {
  login,
  logout,
  getCurrentUser,
  getAuthHeader
};
