import { useState } from "react";
import { Modal } from "../ui/Modal";
import { PriorityBadge, StatusBadge } from "../ui/Badge";
import { Spinner } from "../ui/Spinner";
import { useComments, useCreateComment, useDeleteComment } from "../../hooks/useComments";
import { useAuthStore } from "../../store/authStore";
import { IconMessageCircle, IconTrash } from "../ui/Icons";
import type { Task } from "../../api/types";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TaskDetailModal({
  task,
  projectId,
  onClose,
}: {
  task: Task | null;
  projectId: string;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState("");
  const { user } = useAuthStore();
  const { data: comments, isLoading } = useComments(projectId, task?.id);
  const createComment = useCreateComment(projectId, task?.id ?? "");
  const deleteComment = useDeleteComment(projectId, task?.id ?? "");

  if (!task) return null;

  function submit() {
    const content = draft.trim();
    if (!content) return;
    createComment.mutate(content, { onSuccess: () => setDraft("") });
  }

  return (
    <Modal open={Boolean(task)} onClose={onClose} title={task.title} size="lg">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className="text-xs text-surface-400">
            Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}
      </div>

      {task.description && (
        <p className="mt-4 text-sm leading-relaxed text-surface-600 dark:text-surface-300">{task.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-surface-400">
        {task.assignee && <span>Assigned to {task.assignee.name}</span>}
        {task.creator && <span>Created by {task.creator.name}</span>}
      </div>

      <div className="mt-6 border-t border-surface-100 pt-5 dark:border-surface-800">
        <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-surface-800 dark:text-surface-100">
          <IconMessageCircle className="h-4 w-4" />
          Comments {comments && comments.length > 0 ? `(${comments.length})` : ""}
        </p>

        {isLoading && (
          <div className="flex justify-center py-4">
            <Spinner className="h-4 w-4 text-brand-500" />
          </div>
        )}

        {!isLoading && comments && comments.length === 0 && (
          <p className="py-3 text-sm text-surface-400">No comments yet — be the first to weigh in.</p>
        )}

        <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
          {comments?.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-gradient text-[9px] font-bold text-white">
                {initials(c.author.name)}
              </span>
              <div className="min-w-0 flex-1 rounded-xl bg-surface-50 px-3 py-2 dark:bg-surface-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-surface-800 dark:text-surface-100">{c.author.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-surface-400">{relativeTime(c.createdAt)}</span>
                    {c.authorId === user?.id && (
                      <button
                        onClick={() => deleteComment.mutate(c.id)}
                        aria-label="Delete comment"
                        className="text-surface-300 hover:text-red-500"
                      >
                        <IconTrash className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-surface-700 dark:text-surface-200">
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <textarea
            className="input flex-1 resize-none"
            rows={2}
            placeholder="Add a comment..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <button
            onClick={submit}
            disabled={createComment.isPending || !draft.trim()}
            className="btn-primary self-end"
          >
            {createComment.isPending && <Spinner className="h-4 w-4" />}
            Post
          </button>
        </div>
      </div>
    </Modal>
  );
}
