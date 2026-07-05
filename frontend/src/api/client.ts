import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, updateAccessToken } = useAuthStore.getState();
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await axios.post(`${api.defaults.baseURL}/api/v1/auth/refresh`, { refreshToken });
  const { accessToken } = res.data.data;
  updateAccessToken(accessToken);
  return accessToken;
}

// On a 401, attempt exactly one silent refresh + retry before forcing logout/login.
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retry && !original.url?.includes("/auth/")) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken();
        const newToken = await refreshPromise;
        refreshPromise = null;
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        refreshPromise = null;
        useAuthStore.getState().clearSession();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
