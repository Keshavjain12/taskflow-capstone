import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useDarkMode } from "../../hooks/useDarkMode";
import { IconLogout, IconMoon, IconSun } from "../ui/Icons";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition hover:bg-surface-100 dark:hover:bg-surface-800"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
          {initials(user.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-surface-800 dark:text-surface-100">
            {user.name}
          </span>
          <span className="block truncate text-xs text-surface-400">{user.email}</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.14 }}
              className="card absolute bottom-full left-0 z-40 mb-2 w-full min-w-[200px] overflow-hidden p-1.5"
            >
              <button
                onClick={() => {
                  toggle();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-surface-700 transition hover:bg-surface-100 dark:text-surface-200 dark:hover:bg-surface-800"
              >
                {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
                {isDark ? "Light mode" : "Dark mode"}
              </button>
              <button
                onClick={() => logout.mutate()}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <IconLogout className="h-4 w-4" />
                Log out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
