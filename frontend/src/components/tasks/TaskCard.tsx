import clsx from "clsx";
import { forwardRef } from "react";
import { PriorityBadge } from "../ui/Badge";
import { IconCalendar, IconChevronDown, IconTrash } from "../ui/Icons";
import type { Task, TaskStatus } from "../../api/types";

const PRIORITY_BORDER: Record<Task["priority"], string> = {
  LOW: "before:bg-surface-300 dark:before:bg-surface-700",
  MEDIUM: "before:bg-sky-400",
  HIGH: "before:bg-orange-400",
  URGENT: "before:bg-red-500",
};

const STATUS_OPTIONS: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function formatDue(iso: string) {
  const date = new Date(iso);
  const overdue = date.getTime() < Date.now();
  return { label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), overdue };
}

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onOpenDetail?: () => void;
  isDragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
  style?: React.CSSProperties;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(function TaskCard(
  { task, onDelete, onStatusChange, onOpenDetail, isDragging, dragHandleProps, style },
  ref,
) {
  const due = task.dueDate ? formatDue(task.dueDate) : null;

  return (
    <div
      ref={ref}
      style={style}
      {...dragHandleProps}
      className={clsx(
        "card group relative cursor-grab space-y-3 p-4 pl-5 before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-full",
        PRIORITY_BORDER[task.priority],
        isDragging ? "opacity-50 shadow-glow" : "hover:shadow-card-hover",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4
          onClick={(e) => {
            if (!onOpenDetail) return;
            e.stopPropagation();
            onOpenDetail();
          }}
          onPointerDown={(e) => onOpenDetail && e.stopPropagation()}
          className={clsx(
            "text-sm font-medium leading-snug text-surface-900 dark:text-surface-100",
            onOpenDetail && "cursor-pointer hover:text-brand-600 dark:hover:text-brand-400",
          )}
        >
          {task.title}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`Delete task ${task.title}`}
          className="shrink-0 rounded-md p-1 text-surface-300 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-500/10"
        >
          <IconTrash className="h-3.5 w-3.5" />
        </button>
      </div>

      {task.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-surface-500 dark:text-surface-400">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        {due && (
          <span
            className={clsx(
              "flex items-center gap-1 text-[11px] font-medium",
              due.overdue ? "text-red-500" : "text-surface-400",
            )}
          >
            <IconCalendar className="h-3 w-3" />
            {due.label}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-surface-100 pt-2.5 dark:border-surface-800">
        {task.assignee ? (
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-gradient text-[9px] font-bold text-white">
              {initials(task.assignee.name)}
            </span>
            <span className="truncate text-[11px] text-surface-400">{task.assignee.name}</span>
          </div>
        ) : (
          <span className="text-[11px] text-surface-300 dark:text-surface-600">Unassigned</span>
        )}

        <div className="relative shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          <select
            className="peer appearance-none rounded-full border border-surface-200 bg-surface-50 py-1 pl-2.5 pr-6 text-[11px] font-medium text-surface-600 transition hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300"
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            aria-label={`Change status for ${task.title}`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
          <IconChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-surface-400 peer-focus:text-brand-500" />
        </div>
      </div>
    </div>
  );
});
