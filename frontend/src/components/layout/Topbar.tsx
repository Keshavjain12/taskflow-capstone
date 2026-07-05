import { useParams, useLocation } from "react-router-dom";
import { useProject } from "../../hooks/useProjects";
import { IconMenu } from "../ui/Icons";

export function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const location = useLocation();
  const { id } = useParams();
  const { data: project } = useProject(id);

  const isBoard = location.pathname.startsWith("/projects/") && Boolean(id);
  const title = isBoard ? project?.name ?? "Project" : "Projects";
  const crumb = isBoard ? "Projects" : undefined;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-surface-200 bg-white/80 px-4 backdrop-blur-xl dark:border-surface-800 dark:bg-surface-950/80 sm:px-6 lg:hidden">
      <button
        onClick={onOpenMobile}
        className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
        aria-label="Open menu"
      >
        <IconMenu className="h-5 w-5" />
      </button>
      <div className="min-w-0">
        {crumb && <p className="text-xs text-surface-400">{crumb}</p>}
        <h1 className="truncate text-sm font-semibold text-surface-900 dark:text-surface-100">{title}</h1>
      </div>
    </header>
  );
}
