import { api } from "./client";
import type { ApiUser } from "./types";

export interface AuthResponse {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  register: (input: { name: string; email: string; password: string }) =>
    api.post<{ data: AuthResponse }>("/api/v1/auth/register", input).then((r) => r.data.data),

  login: (input: { email: string; password: string }) =>
    api.post<{ data: AuthResponse }>("/api/v1/auth/login", input).then((r) => r.data.data),

  logout: () => api.post("/api/v1/auth/logout"),

  me: () => api.get<{ data: ApiUser }>("/api/v1/auth/me").then((r) => r.data.data),
};
