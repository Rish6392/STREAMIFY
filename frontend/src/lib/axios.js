
import axios from 'axios';

// In development, hit the local backend. In production, use VITE_API_URL if provided; otherwise fall back to "/api".
// Set VITE_API_URL in your Vercel frontend project to something like:
//   https://your-backend-hostname.example.com/api
const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5002/api'
  : (import.meta.env.VITE_API_URL || '/api');

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request (required for cookie-based auth)
});

export default axiosInstance;
