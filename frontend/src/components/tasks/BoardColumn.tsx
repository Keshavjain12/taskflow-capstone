import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { ReactNode } from "react";
import type { TaskStatus } from "../../api/types";

const COLUMN_DOT: Record<TaskStatus, string> = {
  TODO: "bg-surface-400",
  IN_PROGRESS: "bg-blue-500",
  IN_REVIEW: "bg-amber-500",
  DONE: "bg-emerald-500",
};

export function BoardColumn({
  status,
  label,
  count,
  children,
}: {
  status: TaskStatus;
  label: string;
  count: number;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex min-h-[16rem] flex-col gap-3 rounded-2xl border p-3 transition-colors",
        isOver
          ? "border-brand-300 bg-brand-gradient-soft dark:border-brand-700"
          : "border-transparent bg-surface-100/50 dark:bg-surface-900/40",
      )}
    >
      <div className="flex items-center gap-2 px-1">
        <span className={clsx("h-2 w-2 rounded-full", COLUMN_DOT[status])} />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          {label}
        </h2>
        <span className="ml-auto rounded-full bg-surface-200/70 px-2 py-0.5 text-[11px] font-semibold text-surface-500 dark:bg-surface-800 dark:text-surface-400">
          {count}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5">{children}</div>
    </div>
  );
}
