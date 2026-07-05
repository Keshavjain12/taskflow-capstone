import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { commentsApi } from "../api/comments.api";

export function useComments(projectId: string, taskId: string | undefined) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => commentsApi.list(projectId, taskId as string),
    enabled: Boolean(taskId),
  });
}

export function useCreateComment(projectId: string, taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => commentsApi.create(projectId, taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
    onError: () => toast.error("Could not post comment"),
  });
}

export function useDeleteComment(projectId: string, taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentsApi.remove(projectId, taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
    onError: () => toast.error("Could not delete comment"),
  });
}
