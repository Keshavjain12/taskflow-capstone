import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "../components/projects/ProjectCard";
import { CreateProjectModal } from "../components/projects/CreateProjectModal";
import { CardSkeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { IconPlus, IconSearch } from "../components/ui/Icons";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function ProjectsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useProjects({ search: search || undefined });

  const total = data?.meta.total ?? 0;

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-brand-gradient-soft" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
              {greeting()}, {user?.name.split(" ")[0]}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-surface-900 dark:text-surface-50 sm:text-3xl">
              Your projects
            </h1>
            <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400">
              {total > 0 ? `${total} project${total === 1 ? "" : "s"} in flight.` : "Everything you own or collaborate on."}
            </p>
          </div>
          <button className="btn-primary shrink-0" onClick={() => setModalOpen(true)}>
            <IconPlus className="h-4 w-4" />
            New project
          </button>
        </div>
      </div>

      <div className="relative mt-6 max-w-sm">
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
        <input
          className="input pl-10"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="mt-6">
          <ErrorState message="Could not load projects." onRetry={() => refetch()} />
        </div>
      )}

      {!isLoading && !isError && data && data.data.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
          <EmptyState
            title="No projects yet"
            description="Create your first project to start organizing tasks."
            action={
              <button className="btn-primary" onClick={() => setModalOpen(true)}>
                <IconPlus className="h-4 w-4" />
                Create a project
              </button>
            }
          />
        </motion.div>
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}

      <CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
