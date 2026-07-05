import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const navigate = useNavigate();
  const { user, setSession, clearSession } = useAuthStore();

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setSession(data);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/projects");
    },
    onError: () => toast.error("Invalid email or password"),
  });

  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setSession(data);
      toast.success("Account created — welcome to TaskFlow!");
      navigate("/projects");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.error?.message ?? "Could not create account"),
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSession();
      toast.success("Logged out");
      navigate("/login");
    },
  });

  return { user, login, register, logout, isAuthenticated: Boolean(user) };
}
