import { api } from "./client";
import type { Comment } from "./types";

export const commentsApi = {
  list: (projectId: string, taskId: string) =>
    api
      .get<{ data: Comment[] }>(`/api/v1/projects/${projectId}/tasks/${taskId}/comments`)
      .then((r) => r.data.data),

  create: (projectId: string, taskId: string, content: string) =>
    api
      .post<{ data: Comment }>(`/api/v1/projects/${projectId}/tasks/${taskId}/comments`, { content })
      .then((r) => r.data.data),

  remove: (projectId: string, taskId: string, commentId: string) =>
    api.delete(`/api/v1/projects/${projectId}/tasks/${taskId}/comments/${commentId}`),
};
