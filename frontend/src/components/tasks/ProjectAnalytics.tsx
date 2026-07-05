import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Task, TaskPriority, TaskStatus } from "../../api/types";
import { EmptyState } from "../ui/EmptyState";
import { IconChartBar } from "../ui/Icons";

const STATUS_ORDER: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: "#9d9db0",
  IN_PROGRESS: "#3b82f6",
  IN_REVIEW: "#f59e0b",
  DONE: "#10b981",
};
const PRIORITY_ORDER: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: "#9d9db0",
  MEDIUM: "#0ea5e9",
  HIGH: "#f97316",
  URGENT: "#ef4444",
};

function tooltipStyle() {
  return {
    background: "var(--tf-tooltip-bg, #16161f)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    fontSize: 12,
    color: "#fff",
    padding: "8px 10px",
  };
}

export function ProjectAnalytics({ tasks }: { tasks: Task[] }) {
  const statusData = useMemo(
    () =>
      STATUS_ORDER.map((status) => ({
        status,
        label: status.replace("_", " "),
        value: tasks.filter((t) => t.status === status).length,
      })),
    [tasks],
  );

  const priorityData = useMemo(
    () =>
      PRIORITY_ORDER.map((priority) => ({
        priority,
        value: tasks.filter((t) => t.priority === priority).length,
      })),
    [tasks],
  );

  const completionTrend = useMemo(() => {
    const days: { date: string; label: string; completed: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push({ date: d.toISOString().slice(0, 10), label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), completed: 0 });
    }
    const byDate = new Map(days.map((d) => [d.date, d]));
    tasks
      .filter((t) => t.status === "DONE")
      .forEach((t) => {
        const key = new Date(t.updatedAt).toISOString().slice(0, 10);
        const bucket = byDate.get(key);
        if (bucket) bucket.completed += 1;
      });
    return days;
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No data yet"
        description="Create a few tasks and this dashboard fills itself in."
        icon={<IconChartBar className="h-6 w-6" />}
      />
    );
  }

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === "DONE").length;
  const overdueCount = tasks.filter((t) => t.dueDate && t.status !== "DONE" && new Date(t.dueDate) < new Date()).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs font-medium text-surface-400">Completion rate</p>
          <p className="mt-1 font-display text-2xl font-bold text-surface-900 dark:text-surface-50">
            {total > 0 ? Math.round((doneCount / total) * 100) : 0}%
          </p>
          <p className="mt-0.5 text-xs text-surface-400">
            {doneCount} of {total} tasks done
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-surface-400">Total tasks</p>
          <p className="mt-1 font-display text-2xl font-bold text-surface-900 dark:text-surface-50">{total}</p>
          <p className="mt-0.5 text-xs text-surface-400">across all columns</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-surface-400">Overdue</p>
          <p className={`mt-1 font-display text-2xl font-bold ${overdueCount > 0 ? "text-red-500" : "text-surface-900 dark:text-surface-50"}`}>
            {overdueCount}
          </p>
          <p className="mt-0.5 text-xs text-surface-400">not done, past due date</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <p className="mb-3 text-sm font-semibold text-surface-800 dark:text-surface-100">Status breakdown</p>
          <div className="flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="label" innerRadius={45} outerRadius={70} paddingAngle={2}>
                    {statusData.map((d) => (
                      <Cell key={d.status} fill={STATUS_COLORS[d.status]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle()} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {statusData.map((d) => (
                <div key={d.status} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                    <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[d.status] }} />
                    {d.label}
                  </span>
                  <span className="font-semibold text-surface-700 dark:text-surface-200">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-4">
          <p className="mb-3 text-sm font-semibold text-surface-800 dark:text-surface-100">Priority mix</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,140,0.15)" vertical={false} />
                <XAxis dataKey="priority" tick={{ fontSize: 11, fill: "#9d9db0" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9d9db0" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={tooltipStyle()} cursor={{ fill: "rgba(120,120,140,0.08)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {priorityData.map((d) => (
                    <Cell key={d.priority} fill={PRIORITY_COLORS[d.priority]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <p className="mb-3 text-sm font-semibold text-surface-800 dark:text-surface-100">Completed, last 14 days</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,140,0.15)" vertical={false} />
              <XAxis dataKey="label" interval={1} tick={{ fontSize: 10, fill: "#9d9db0" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9d9db0" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={tooltipStyle()} cursor={{ fill: "rgba(120,120,140,0.08)" }} />
              <Bar dataKey="completed" fill="#7452f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
