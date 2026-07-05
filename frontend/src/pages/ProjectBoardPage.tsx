import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useProject } from "../hooks/useProjects";
import { useDeleteTask, useTasks, useUpdateTask } from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { DraggableTaskCard } from "../components/tasks/DraggableTaskCard";
import { BoardColumn } from "../components/tasks/BoardColumn";
import { CreateTaskModal } from "../components/tasks/CreateTaskModal";
import { TaskDetailModal } from "../components/tasks/TaskDetailModal";
import { ProjectAnalytics } from "../components/tasks/ProjectAnalytics";
import { ActivityFeed } from "../components/tasks/ActivityFeed";
import { InviteMemberModal } from "../components/projects/InviteMemberModal";
import { MemberAvatarStack } from "../components/projects/MemberAvatarStack";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { CardSkeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { IconActivity, IconArrowLeft, IconChartBar, IconKanban, IconPlus } from "../components/ui/Icons";
import type { Task, TaskStatus } from "../api/types";
import clsx from "clsx";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "TODO", label: "To do" },
  { status: "IN_PROGRESS", label: "In progress" },
  { status: "IN_REVIEW", label: "In review" },
  { status: "DONE", label: "Done" },
];

const TABS = [
  { id: "board", label: "Board", icon: IconKanban },
  { id: "analytics", label: "Analytics", icon: IconChartBar },
  { id: "activity", label: "Activity", icon: IconActivity },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProjectBoardPage() {
  const { id = "" } = useParams();
  const [tab, setTab] = useState<TabId>("board");
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToView, setTaskToView] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data, isLoading, isError, refetch } = useTasks(id, { limit: 100 });
  const updateTask = useUpdateTask(id);
  const deleteTask = useDeleteTask(id);

  const tasks = data?.data ?? [];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === active.id);
    if (task && task.status !== newStatus) {
      updateTask.mutate({ id: task.id, status: newStatus });
    }
  }

  return (
    <div>
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400"
      >
        <IconArrowLeft className="h-4 w-4" />
        All projects
      </Link>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-50">
            {projectLoading ? "Loading..." : project?.name}
          </h1>
          {project?.description && (
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {project?.members && <MemberAvatarStack members={project.members} onInvite={() => setInviteOpen(true)} />}
          <button className="btn-primary shrink-0" onClick={() => setModalOpen(true)}>
            <IconPlus className="h-4 w-4" />
            New task
          </button>
        </div>
      </div>

      <div className="mt-6 inline-flex items-center gap-1 rounded-xl border border-surface-200 bg-white p-1 dark:border-surface-800 dark:bg-surface-900">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
              tab === t.id
                ? "bg-brand-gradient text-white shadow-glow"
                : "text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100",
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {isError && (
        <div className="mt-6">
          <ErrorState message="Could not load tasks." onRetry={() => refetch()} />
        </div>
      )}

      {!isError && tab === "board" && (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((col) => {
              const columnTasks = tasks.filter((t) => t.status === col.status);
              return (
                <BoardColumn key={col.status} status={col.status} label={col.label} count={columnTasks.length}>
                  {isLoading && <CardSkeleton />}

                  {!isLoading && columnTasks.length === 0 && <EmptyState title="No tasks" compact />}

                  {!isLoading &&
                    columnTasks.map((task) => (
                      <DraggableTaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={(status) => updateTask.mutate({ id: task.id, status })}
                        onDelete={() => setTaskToDelete(task)}
                        onOpenDetail={() => setTaskToView(task)}
                      />
                    ))}
                </BoardColumn>
              );
            })}
          </div>

          <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.16,1,0.3,1)" }}>
            {activeTask && (
              <div className="rotate-2">
                <TaskCard task={activeTask} onDelete={() => {}} onStatusChange={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {!isError && tab === "analytics" && (
        <div className="mt-6">
          {isLoading ? <CardSkeleton /> : <ProjectAnalytics tasks={tasks} />}
        </div>
      )}

      {!isError && tab === "activity" && (
        <div className="mt-6">{isLoading ? <CardSkeleton /> : <ActivityFeed tasks={tasks} />}</div>
      )}

      <CreateTaskModal projectId={id} open={modalOpen} onClose={() => setModalOpen(false)} />
      <TaskDetailModal task={taskToView} projectId={id} onClose={() => setTaskToView(null)} />
      <InviteMemberModal projectId={id} open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title={`Delete "${taskToDelete?.title}"?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) deleteTask.mutate(taskToDelete.id);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
}
