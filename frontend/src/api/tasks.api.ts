import { api } from "./client";
import type { PaginationMeta, Task, TaskPriority, TaskStatus } from "./types";

export interface ListTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  sortBy?: "createdAt" | "updatedAt" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
}

export const tasksApi = {
  list: (projectId: string, params: ListTasksParams = {}) =>
    api
      .get<{ data: Task[]; meta: PaginationMeta }>(`/api/v1/projects/${projectId}/tasks`, { params })
      .then((r) => r.data),

  create: (
    projectId: string,
    input: { title: string; description?: string; status?: TaskStatus; priority?: TaskPriority; assigneeId?: string },
  ) => api.post<{ data: Task }>(`/api/v1/projects/${projectId}/tasks`, input).then((r) => r.data.data),

  update: (projectId: string, id: string, input: Partial<Task>) =>
    api.patch<{ data: Task }>(`/api/v1/projects/${projectId}/tasks/${id}`, input).then((r) => r.data.data),

  remove: (projectId: string, id: string) => api.delete(`/api/v1/projects/${projectId}/tasks/${id}`),
};
