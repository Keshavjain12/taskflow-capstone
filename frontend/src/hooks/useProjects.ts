import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectsApi, type ListProjectsParams } from "../api/projects.api";

export function useProjects(params: ListProjectsParams = {}) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => projectsApi.list(params),
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectsApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
    },
    onError: () => toast.error("Could not create project"),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: () => toast.error("Could not delete project"),
  });
}

export function useAddMember(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { email: string; role?: "OWNER" | "MEMBER" }) =>
      projectsApi.addMember(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      toast.success("Member added");
    },
    onError: (err: any) => toast.error(err?.response?.data?.error?.message ?? "Could not add member"),
  });
}
