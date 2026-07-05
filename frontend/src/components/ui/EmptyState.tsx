import { ReactNode } from "react";
import { IconInbox } from "./Icons";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  compact?: boolean;
}

export function EmptyState({ title, description, action, icon, compact }: EmptyStateProps) {
  return (
    <div
      className={
        compact
          ? "flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-200 p-6 text-center dark:border-surface-800"
          : "flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-200 bg-surface-50/60 p-14 text-center dark:border-surface-800 dark:bg-surface-900/40"
      }
    >
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-gradient-soft text-brand-500 dark:text-brand-400">
        {icon ?? <IconInbox className="h-6 w-6" />}
      </div>
      <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-surface-500 dark:text-surface-400">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
