import clsx from "clsx";
import { IconAlertTriangle, IconCheckCircle, IconFolder, IconLayers } from "../ui/Icons";

interface DashboardStatsProps {
  totalProjects: number;
  totalTasks: number;
  completedThisWeek: number;
  overdueCount: number;
  isLoading: boolean;
}

type Tone = "brand" | "sky" | "emerald" | "red" | "surface";

export function DashboardStats({
  totalProjects,
  totalTasks,
  completedThisWeek,
  overdueCount,
  isLoading,
}: DashboardStatsProps) {
  const stats: { label: string; value: number; icon: typeof IconFolder; tone: Tone }[] = [
    { label: "Projects", value: totalProjects, icon: IconFolder, tone: "brand" },
    { label: "Total tasks", value: totalTasks, icon: IconLayers, tone: "sky" },
    { label: "Completed this week", value: completedThisWeek, icon: IconCheckCircle, tone: "emerald" },
    { label: "Overdue", value: overdueCount, icon: IconAlertTriangle, tone: overdueCount > 0 ? "red" : "surface" },
  ];

  const toneClasses: Record<Tone, string> = {
    brand: "bg-brand-gradient-soft text-brand-600 dark:text-brand-400",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    surface: "bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400",
  };

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="card p-4">
          <span className={clsx("grid h-8 w-8 place-items-center rounded-lg", toneClasses[s.tone])}>
            <s.icon className="h-4 w-4" />
          </span>
          <p className="mt-3 font-display text-2xl font-bold text-surface-900 dark:text-surface-50">
            {isLoading ? <span className="skeleton-shimmer inline-block h-6 w-8 rounded" /> : s.value}
          </p>
          <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
