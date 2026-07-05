import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Project } from "../../api/types";
import { IconLayers, IconUsers } from "../ui/Icons";

const GRADIENTS = [
  "from-brand-500 to-accent-500",
  "from-sky-500 to-brand-500",
  "from-emerald-500 to-sky-500",
  "from-amber-500 to-accent-500",
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function timeAgo(iso: string) {
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

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/projects/${project.id}`} className="card-interactive group relative block overflow-hidden p-5">
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.16]`}
        />

        <div className="flex items-start gap-3">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-xs font-bold text-white shadow-soft`}
          >
            {initials(project.owner?.name ?? project.name)}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="truncate font-display text-sm font-semibold text-surface-900 transition group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
              {project.name}
            </h3>
            <p className="mt-0.5 text-xs text-surface-400">Updated {timeAgo(project.updatedAt)}</p>
          </div>
        </div>

        <p className="mt-3.5 line-clamp-2 min-h-[2.5rem] text-sm text-surface-500 dark:text-surface-400">
          {project.description || "No description yet."}
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-surface-100 pt-3.5 text-xs font-medium text-surface-500 dark:border-surface-800 dark:text-surface-400">
          <span className="flex items-center gap-1.5">
            <IconLayers className="h-3.5 w-3.5" />
            {project._count?.tasks ?? 0} tasks
          </span>
          <span className="flex items-center gap-1.5">
            <IconUsers className="h-3.5 w-3.5" />
            {project._count?.members ?? 0} members
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
