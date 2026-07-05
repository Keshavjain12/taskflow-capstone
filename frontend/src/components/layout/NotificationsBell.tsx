import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useNotifications } from "../../hooks/useNotifications";
import { IconBell, IconClock } from "../ui/Icons";

function dueLabel(iso: string, overdue: boolean) {
  const date = new Date(iso);
  const label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return overdue ? `Overdue — was due ${label}` : `Due ${label}`;
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const { dueTasks, count } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-surface-200 bg-white text-surface-500 transition hover:border-surface-300 hover:text-surface-800 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
      >
        <IconBell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.14 }}
              className="card absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden p-0"
            >
              <div className="border-b border-surface-100 px-4 py-3 dark:border-surface-800">
                <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">Due soon</p>
                <p className="text-xs text-surface-400">Assigned to you, overdue or due in the next 3 days</p>
              </div>
              <div className="max-h-72 overflow-y-auto p-1.5">
                {dueTasks.length === 0 && (
                  <p className="px-3 py-8 text-center text-sm text-surface-400">You're all caught up.</p>
                )}
                {dueTasks.map(({ task, projectId, projectName, overdue }) => (
                  <Link
                    key={task.id}
                    to={`/projects/${projectId}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 transition hover:bg-surface-50 dark:hover:bg-surface-800"
                  >
                    <p className="truncate text-sm font-medium text-surface-800 dark:text-surface-100">
                      {task.title}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                      <IconClock className={`h-3 w-3 ${overdue ? "text-red-500" : "text-surface-400"}`} />
                      <span className={overdue ? "font-medium text-red-500" : "text-surface-400"}>
                        {dueLabel(task.dueDate as string, overdue)}
                      </span>
                      <span className="text-surface-300">&middot;</span>
                      <span className="truncate text-surface-400">{projectName}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
