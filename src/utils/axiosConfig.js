import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Base URL Backend Anda
});

// Interceptor: Setiap request keluar, selipkan token jika ada
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token dari LocalStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
