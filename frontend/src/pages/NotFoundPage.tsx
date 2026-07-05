import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">404</h1>
      <p className="text-slate-500 dark:text-slate-400">This page doesn't exist.</p>
      <Link to="/projects" className="btn-primary">
        Back to projects
      </Link>
    </div>
  );
}
