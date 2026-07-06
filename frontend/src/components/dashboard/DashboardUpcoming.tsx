import { Link } from "react-router-dom";
import clsx from "clsx";
import { EmptyState } from "../ui/EmptyState";
import { IconCheckCircle, IconClock } from "../ui/Icons";
import type { DashboardTask } from "../../hooks/useDashboard";

function formatDue(iso: string) {
  const due = new Date(iso);
  const now = new Date();
  const diffDays = Math.round((due.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "due today";
  if (diffDays === 1) return "due tomorrow";
  return `due in ${diffDays}d`;
}

/**
 * Tasks with a due date across every project, soonest first. Overdue items
 * (due date in the past, not yet DONE) are called out in red so this doubles
 * as an at-a-glance "what needs attention" widget.
 */
export function DashboardUpcoming({ tasks, isLoading }: { tasks: DashboardTask[]; isLoading: boolean }) {
  if (isLoading) {
    return <div className="card h-48 animate-pulse p-4" />;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        compact
        title="Nothing due"
        description="Tasks with a due date will show up here as they approach."
        icon={<IconCheckCircle className="h-5 w-5" />}
      />
    );
  }

  return (
    <div className="card divide-y divide-surface-100 p-0 dark:divide-surface-800">
      {tasks.map((task) => {
        const overdue = new Date(task.dueDate as string).getTime() < Date.now();
        return (
          <Link
            key={task.id}
            to={`/projects/${task.projectId}`}
            className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-surface-50 dark:hover:bg-surface-800/60"
          >
            <span
              className={clsx(
                "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                overdue
                  ? "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"
                  : "bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400",
              )}
            >
              <IconClock className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-surface-900 dark:text-surface-50">{task.title}</p>
              <p className="mt-0.5 text-xs text-surface-400">{task.projectName}</p>
            </div>
            <span
              className={clsx(
                "shrink-0 text-xs font-semibold",
                overdue ? "text-red-500 dark:text-red-400" : "text-amber-600 dark:text-amber-400",
              )}
            >
              {formatDue(task.dueDate as string)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
