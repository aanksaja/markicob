import axios from "axios";
// import { authService } from './authService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include token
// api.interceptors.request.use(
//     (config) => {
//       const user = localStorage.getItem('user');
//       if (user.token) {
//         // Remove all quotation marks from the token
//         const cleanToken = user.token.replace(/"/g, '');
//         config.headers.Authorization = `Bearer ${cleanToken}`;
        
//         // For debugging
//         console.log('Authorization header:', config.headers.Authorization);
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        
        // Check if token exists in the parsed data
        if (userData.token) {
          // Clean the token (remove quotes if any)
          const cleanToken = userData.token.replace(/"/g, '');
          
          // Add Authorization header
          config.headers.Authorization = `Bearer ${cleanToken}`;
          
          // Debugging logs
          console.log('Token found and added to headers');
          console.log('Authorization header:', config.headers.Authorization);
        } else {
          console.warn('Token not found in user data');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.warn('No user data found in localStorage');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

  

// Interceptor untuk menangani error response
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired atau tidak valid
//       authService.logout();
//       window.location.reload(); // Atau redirect ke login page
//     }
//     return Promise.reject(error);
//   }
// );


// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response?.status === 401) {
//         // Handle token expiration or invalid token
//         authService.logout();
//         window.location.href = '/login';
//       }
//       return Promise.reject(error);
//     }
//   );

export default api;