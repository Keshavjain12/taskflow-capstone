import { Link } from "react-router-dom";
import { StatusBadge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { IconActivity } from "../ui/Icons";
import type { DashboardTask } from "../../hooks/useDashboard";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

/**
 * "Recent activity across your projects" — same real-timestamp approach as
 * the per-project activity feed, merged across every project and tagged
 * with which project each update belongs to.
 */
export function DashboardActivity({ tasks, isLoading }: { tasks: DashboardTask[]; isLoading: boolean }) {
  if (isLoading) {
    return <div className="card h-48 animate-pulse p-4" />;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        compact
        title="No activity yet"
        description="Create a task in one of your projects to see updates here."
        icon={<IconActivity className="h-5 w-5" />}
      />
    );
  }

  return (
    <div className="card divide-y divide-surface-100 p-0 dark:divide-surface-800">
      {tasks.map((task) => {
        const actor = task.assignee ?? task.creator;
        return (
          <Link
            key={task.id}
            to={`/projects/${task.projectId}`}
            className="flex items-start gap-3 px-4 py-3.5 transition hover:bg-surface-50 dark:hover:bg-surface-800/60"
          >
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
              {actor ? initials(actor.name) : "?"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-surface-700 dark:text-surface-200">
                <span className="font-medium text-surface-900 dark:text-surface-50">{task.title}</span>
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <StatusBadge status={task.status} />
                <span className="rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-500 dark:bg-surface-800 dark:text-surface-400">
                  {task.projectName}
                </span>
                <span className="text-xs text-surface-400">{relativeTime(task.updatedAt)}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
