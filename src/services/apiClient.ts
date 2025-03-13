import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5173',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
export default apiClient

// // Add interceptors for error handling
// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     console.error('API Error:', error);
//     return Promise.reject(error);
//   }
// );