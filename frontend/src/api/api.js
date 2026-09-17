import axios from "axios";

const getBaseURL = () => {
  const envUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  if (typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname;
    const isLocalhost = host === "localhost" || host === "127.0.0.1";
    if (!isLocalhost && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))) {
      return `${window.location.protocol}//${host}:5000/api`;
    }
  }
  return envUrl;
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// ==========================
// Automatically attach JWT
// ==========================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;