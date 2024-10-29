// services/api.js
import axios from "axios";
import { useAuthStore } from "../store";

const api = axios.create({
  baseURL: "https://fullstack-app-on-render.onrender.com",
});

// Automatically set the Authorization header if the token is available
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
