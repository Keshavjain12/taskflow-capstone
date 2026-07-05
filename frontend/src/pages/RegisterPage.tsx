import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner";
import { AuthLayout } from "../components/layout/AuthLayout";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100">Create your account</h1>
      <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400">Start organizing your team's work</p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit((data) => registerUser.mutate(data))}>
        <div>
          <label className="label">Name</label>
          <input className="input" placeholder="Ada Lovelace" {...register("name", { required: "Name is required", minLength: 2 })} />
          {errors.name && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="you@example.com" {...register("email", { required: "Email is required" })} />
          {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
            })}
          />
          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.password.message}</p>
          )}
          <p className="mt-1.5 text-xs text-surface-400">8+ characters, one uppercase letter, one number</p>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={registerUser.isPending}>
          {registerUser.isPending && <Spinner className="h-4 w-4" />}
          Create account
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-surface-500 dark:text-surface-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
