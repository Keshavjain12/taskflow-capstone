import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useProjects } from "../../hooks/useProjects";
import { useDarkMode } from "../../hooks/useDarkMode";
import { IconCommand, IconFolder, IconMoon, IconSearch, IconSun } from "../ui/Icons";

interface PaletteAction {
  id: string;
  label: string;
  hint?: string;
  icon: (p: { className?: string }) => JSX.Element;
  run: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { data } = useProjects({ limit: 50 });
  const { isDark, toggle } = useDarkMode();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const projectActions: PaletteAction[] = useMemo(
    () =>
      (data?.data ?? []).map((p) => ({
        id: `project-${p.id}`,
        label: p.name,
        hint: `${p._count?.tasks ?? 0} tasks`,
        icon: IconFolder,
        run: () => navigate(`/projects/${p.id}`),
      })),
    [data, navigate],
  );

  const staticActions: PaletteAction[] = useMemo(
    () => [
      { id: "go-projects", label: "Go to all projects", icon: IconFolder, run: () => navigate("/projects") },
      {
        id: "toggle-theme",
        label: isDark ? "Switch to light mode" : "Switch to dark mode",
        icon: isDark ? IconSun : IconMoon,
        run: toggle,
      },
    ],
    [isDark, navigate, toggle],
  );

  const allActions = [...projectActions, ...staticActions];
  const filtered = query
    ? allActions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
    : allActions;

  function activate(action: PaletteAction) {
    action.run();
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-xl border border-surface-200 bg-white px-3 py-1.5 text-xs text-surface-400 transition hover:border-surface-300 dark:border-surface-800 dark:bg-surface-900 dark:hover:border-surface-700"
      >
        <IconSearch className="h-3.5 w-3.5" />
        Quick jump
        <span className="ml-2 flex items-center gap-0.5 rounded-md border border-surface-200 px-1.5 py-0.5 font-mono text-[10px] text-surface-400 dark:border-surface-700">
          <IconCommand className="h-2.5 w-2.5" />K
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[60] bg-surface-950/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="card fixed left-1/2 top-[18%] z-[61] w-full max-w-lg -translate-x-1/2 overflow-hidden p-0"
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
            >
              <div className="flex items-center gap-2.5 border-b border-surface-100 px-4 py-3 dark:border-surface-800">
                <IconSearch className="h-4 w-4 text-surface-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.max(i - 1, 0));
                    } else if (e.key === "Enter" && filtered[activeIndex]) {
                      activate(filtered[activeIndex]);
                    }
                  }}
                  placeholder="Jump to a project, or search actions..."
                  className="w-full bg-transparent text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none dark:text-surface-100"
                />
                <kbd className="rounded-md border border-surface-200 px-1.5 py-0.5 text-[10px] text-surface-400 dark:border-surface-700">
                  Esc
                </kbd>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm text-surface-400">No matches.</p>
                )}
                {filtered.map((action, i) => (
                  <button
                    key={action.id}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => activate(action)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      i === activeIndex
                        ? "bg-brand-gradient-soft text-brand-700 dark:text-brand-300"
                        : "text-surface-700 hover:bg-surface-50 dark:text-surface-200 dark:hover:bg-surface-800"
                    }`}
                  >
                    <action.icon className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="min-w-0 flex-1 truncate">{action.label}</span>
                    {action.hint && <span className="shrink-0 text-xs text-surface-400">{action.hint}</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
