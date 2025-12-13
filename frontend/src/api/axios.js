import axios from "axios";

const API = process.env.REACT_APP_API_URL;

if (!API) {
  throw new Error("Missing REACT_APP_API_URL. Set it in Cloudflare Pages env vars.");
}

const api = axios.create({
  baseURL: API,
});

// Interceptor: attach token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
