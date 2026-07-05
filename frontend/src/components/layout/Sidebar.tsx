import { NavLink, useParams } from "react-router-dom";
import clsx from "clsx";
import { useProjects } from "../../hooks/useProjects";
import { UserMenu } from "./UserMenu";
import { CommandPalette } from "./CommandPalette";
import { NotificationsBell } from "./NotificationsBell";
import { IconFolder, IconKanban, IconX } from "../ui/Icons";

const PROJECT_DOT_COLORS = ["bg-brand-500", "bg-accent-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500"];

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const { id: activeProjectId } = useParams();
  const { data } = useProjects({ limit: 6 });
  const recent = data?.data ?? [];

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-surface-950/50 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-surface-200 bg-white p-4 transition-transform duration-200 dark:border-surface-800 dark:bg-surface-900",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-1">
          <NavLink to="/projects" className="flex items-center gap-2.5 font-display text-base font-bold text-surface-900 dark:text-surface-50">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">
              <IconKanban className="h-4 w-4" />
            </span>
            TaskFlow
          </NavLink>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden"
            aria-label="Close menu"
          >
            <IconX className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <CommandPalette />
          </div>
          <NotificationsBell />
        </div>

        <nav className="mt-5 space-y-0.5">
          <NavLink
            to="/projects"
            end
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-brand-gradient-soft text-brand-700 dark:text-brand-300"
                  : "text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800",
              )
            }
          >
            <IconFolder className="h-4.5 w-4.5" />
            Projects
          </NavLink>
        </nav>

        {recent.length > 0 && (
          <div className="mt-7">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-surface-400">Recent</p>
            <div className="mt-1.5 space-y-0.5">
              {recent.map((p, i) => (
                <NavLink
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className={clsx(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition",
                    activeProjectId === p.id
                      ? "bg-surface-100 font-medium text-surface-900 dark:bg-surface-800 dark:text-surface-100"
                      : "text-surface-500 hover:bg-surface-100 hover:text-surface-800 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200",
                  )}
                >
                  <span className={clsx("h-1.5 w-1.5 shrink-0 rounded-full", PROJECT_DOT_COLORS[i % PROJECT_DOT_COLORS.length])} />
                  <span className="truncate">{p.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4">
          <UserMenu />
        </div>
      </aside>
    </>
  );
}
