import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner";
import { AuthLayout } from "../components/layout/AuthLayout";

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100">Welcome back</h1>
      <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400">Log in to your TaskFlow account</p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit((data) => login.mutate(data))}>
        <div>
          <label className="label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            className="input"
            placeholder="demo@taskflow.dev"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label !mb-1.5" htmlFor="login-password">Password</label>
          </div>
          <input
            id="login-password"
            type="password"
            className="input"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.password.message}</p>
          )}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={login.isPending}>
          {login.isPending && <Spinner className="h-4 w-4" />}
          Log in
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-surface-500 dark:text-surface-400">
        No account?{" "}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400">
          Register
        </Link>
      </p>
      <div className="mt-4 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-center text-xs text-surface-500 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-400">
        Demo login: <span className="font-mono font-medium text-surface-700 dark:text-surface-300">demo@taskflow.dev</span> /{" "}
        <span className="font-mono font-medium text-surface-700 dark:text-surface-300">Password123!</span>
      </div>
    </AuthLayout>
  );
}
