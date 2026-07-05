import { useQueries } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import { useProjects } from "./useProjects";
import { useAuthStore } from "../store/authStore";
import type { Task } from "../api/types";

export interface DueTask {
  task: Task;
  projectId: string;
  projectName: string;
  overdue: boolean;
}

const SOON_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * Derives a lightweight "notifications" feed from data we already have —
 * tasks assigned to the current user, across every project they belong to,
 * that are overdue or due within the next 3 days. No dedicated notifications
 * backend/table; this is computed client-side from real task data.
 */
export function useNotifications() {
  const { user } = useAuthStore();
  const { data: projectsData, isLoading: projectsLoading } = useProjects({ limit: 50 });
  const projects = projectsData?.data ?? [];

  const taskQueries = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["tasks", project.id, { assigneeId: user?.id, notifications: true }],
      queryFn: () => tasksApi.list(project.id, { assigneeId: user?.id, limit: 50 }),
      enabled: Boolean(user?.id),
      staleTime: 30_000,
    })),
  });

  const isLoading = projectsLoading || taskQueries.some((q) => q.isLoading);
  const now = Date.now();

  const dueTasks: DueTask[] = projects
    .flatMap((project, i) => {
      const tasks = taskQueries[i]?.data?.data ?? [];
      return tasks
        .filter((t) => t.status !== "DONE" && t.dueDate)
        .filter((t) => {
          const due = new Date(t.dueDate as string).getTime();
          return due < now + SOON_WINDOW_MS;
        })
        .map((t) => ({
          task: t,
          projectId: project.id,
          projectName: project.name,
          overdue: new Date(t.dueDate as string).getTime() < now,
        }));
    })
    .sort((a, b) => new Date(a.task.dueDate!).getTime() - new Date(b.task.dueDate!).getTime());

  return { dueTasks, isLoading, count: dueTasks.length };
}
