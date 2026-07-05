import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDarkMode } from "../../hooks/useDarkMode";

export function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/projects" className="flex items-center gap-2 font-semibold text-brand-700 dark:text-brand-400">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">TF</span>
          TaskFlow
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:inline">
                {user.name}
              </span>
              <button className="btn-secondary" onClick={() => logout.mutate()}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
