export const API_URL =
  (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export const API_BASE = `${API_URL}/api`;
export const USER_API = `${API_BASE}/user`;
