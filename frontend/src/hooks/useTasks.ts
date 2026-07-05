import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { tasksApi, type ListTasksParams } from "../api/tasks.api";
import type { Task } from "../api/types";

export function useTasks(projectId: string, params: ListTasksParams = {}) {
  return useQuery({
    queryKey: ["tasks", projectId, params],
    queryFn: () => tasksApi.list(projectId, params),
    enabled: Boolean(projectId),
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof tasksApi.create>[1]) => tasksApi.create(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast.success("Task created");
    },
    onError: () => toast.error("Could not create task"),
  });
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<Task> & { id: string }) => tasksApi.update(projectId, id, input),
    // Optimistic update so drag/drop status changes feel instant.
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const previous = queryClient.getQueriesData({ queryKey: ["tasks", projectId] });
      queryClient.setQueriesData({ queryKey: ["tasks", projectId] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((t: Task) => (t.id === updated.id ? { ...t, ...updated } : t)),
        };
      });
      return { previous };
    },
    onError: (_err, _updated, context) => {
      context?.previous.forEach(([key, value]: any) => queryClient.setQueryData(key, value));
      toast.error("Could not update task");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks", projectId] }),
  });
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast.success("Task deleted");
    },
    onError: () => toast.error("Could not delete task"),
  });
}
