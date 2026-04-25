import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Signup
export const signup = async (userData) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

// ✅ Login
export const login = async (userData) => {
  const res = await api.post("/auth/login", userData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

// ✅ Verify token
export const verifyToken = async () => {
  const res = await api.get("/auth/verify");
  return res.data;
};

// ✅ Logout
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.warn("Server logout failed");
  } finally {
    localStorage.removeItem("token");
  }
};

// ✅ Refresh token
export const refreshToken = async () => {
  const res = await api.post("/auth/refresh");

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};
