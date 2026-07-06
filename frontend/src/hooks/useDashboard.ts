import { useQueries } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import { useProjects } from "./useProjects";
import type { Task } from "../api/types";

export interface DashboardTask extends Task {
  projectName: string;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Aggregates real task data across every project the user belongs to, for the
 * dashboard overview. No dedicated analytics/reporting table — everything
 * here is derived client-side from the same task records the boards use, so
 * the numbers always match what's actually in the database.
 */
export function useDashboardOverview() {
  const { data: projectsData, isLoading: projectsLoading } = useProjects({ limit: 50 });
  const projects = projectsData?.data ?? [];

  const taskQueries = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["tasks", project.id, { limit: 100, dashboard: true }],
      queryFn: () => tasksApi.list(project.id, { limit: 100 }),
      staleTime: 30_000,
    })),
  });

  const isLoading = projectsLoading || taskQueries.some((q) => q.isLoading);

  const allTasks: DashboardTask[] = projects.flatMap((project, i) => {
    const tasks = taskQueries[i]?.data?.data ?? [];
    return tasks.map((t) => ({ ...t, projectName: project.name }));
  });

  const now = Date.now();
  const weekAgo = now - WEEK_MS;

  const completedThisWeek = allTasks.filter(
    (t) => t.status === "DONE" && new Date(t.updatedAt).getTime() >= weekAgo,
  ).length;

  const overdueTasks = allTasks.filter(
    (t) => t.status !== "DONE" && t.dueDate && new Date(t.dueDate).getTime() < now,
  );

  const recentActivity = [...allTasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const upcoming = allTasks
    .filter((t) => t.status !== "DONE" && t.dueDate)
    .sort((a, b) => new Date(a.dueDate as string).getTime() - new Date(b.dueDate as string).getTime())
    .slice(0, 5);

  return {
    isLoading,
    totalProjects: projects.length,
    totalTasks: allTasks.length,
    completedThisWeek,
    overdueCount: overdueTasks.length,
    recentActivity,
    upcoming,
  };
}
