import { PriorityBadge, StatusBadge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { IconActivity } from "../ui/Icons";
import type { Task } from "../../api/types";

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
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * A "recent activity" view derived entirely from real task timestamps —
 * there's no dedicated audit-log table, so this reads created/updated tasks
 * sorted by recency rather than fabricating discrete events.
 */
export function ActivityFeed({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <EmptyState title="No activity yet" description="Create a task to get things moving." icon={<IconActivity className="h-6 w-6" />} />;
  }

  const sorted = [...tasks].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <div className="card divide-y divide-surface-100 p-0 dark:divide-surface-800">
      {sorted.map((task) => {
        const isNew = new Date(task.updatedAt).getTime() - new Date(task.createdAt).getTime() < 5000;
        const actor = task.assignee ?? task.creator;
        return (
          <div key={task.id} className="flex items-start gap-3 px-4 py-3.5">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
              {actor ? initials(actor.name) : "?"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-surface-700 dark:text-surface-200">
                <span className="font-medium text-surface-900 dark:text-surface-50">{actor?.name ?? "Someone"}</span>{" "}
                {isNew ? "created" : "updated"}{" "}
                <span className="font-medium text-surface-900 dark:text-surface-50">{task.title}</span>
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                <span className="text-xs text-surface-400">{relativeTime(task.updatedAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
