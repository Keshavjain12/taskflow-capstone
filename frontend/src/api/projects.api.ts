import { api } from "./client";
import type { PaginationMeta, Project } from "./types";

export interface ListProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export const projectsApi = {
  list: (params: ListProjectsParams = {}) =>
    api
      .get<{ data: Project[]; meta: PaginationMeta }>("/api/v1/projects", { params })
      .then((r) => r.data),

  getById: (id: string) => api.get<{ data: Project }>(`/api/v1/projects/${id}`).then((r) => r.data.data),

  create: (input: { name: string; description?: string }) =>
    api.post<{ data: Project }>("/api/v1/projects", input).then((r) => r.data.data),

  update: (id: string, input: { name?: string; description?: string }) =>
    api.patch<{ data: Project }>(`/api/v1/projects/${id}`, input).then((r) => r.data.data),

  remove: (id: string) => api.delete(`/api/v1/projects/${id}`),

  addMember: (id: string, input: { email: string; role?: "OWNER" | "MEMBER" }) =>
    api.post(`/api/v1/projects/${id}/members`, input).then((r) => r.data.data),
};
