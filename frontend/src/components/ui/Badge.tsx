import clsx from "clsx";
import type { TaskPriority, TaskStatus } from "../../api/types";

const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300",
  IN_PROGRESS: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  IN_REVIEW: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  DONE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
};

const priorityStyles: Record<TaskPriority, string> = {
  LOW: "bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400",
  MEDIUM: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  HIGH: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  URGENT: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

const priorityDot: Record<TaskPriority, string> = {
  LOW: "bg-surface-400",
  MEDIUM: "bg-sky-500",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-500",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={clsx("rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide", statusStyles[status])}>
      {status.replace("_", " ")}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        priorityStyles[priority],
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", priorityDot[priority])} />
      {priority}
    </span>
  );
}
