import axios from "axios";
import { USER_API } from "../config/api";

const apiClient = axios.create({
  baseURL: USER_API,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken && accessToken !== "null" && accessToken !== "undefined") {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refresh_token");

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      !refreshToken ||
      originalRequest?.url?.includes("/token/refresh/")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= axios
        .post(`${USER_API}/token/refresh/`, {
          refresh: refreshToken,
        })
        .then(({ data }) => {
          localStorage.setItem("access_token", data.access);

          if (data.refresh) {
            localStorage.setItem("refresh_token", data.refresh);
          }

          return data.access;
        })
        .catch((refreshError) => {
          clearTokens();
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });

      const accessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
