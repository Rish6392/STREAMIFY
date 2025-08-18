
import axios from 'axios';

const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:5002/api"
  : "https://streamify-backend-abc123.vercel.app/api"; // Replace abc123 with your actual deployment URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
