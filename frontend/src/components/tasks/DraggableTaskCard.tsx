import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./TaskCard";
import type { Task, TaskStatus } from "../../api/types";

export function DraggableTaskCard({
  task,
  onDelete,
  onStatusChange,
  onOpenDetail,
}: {
  task: Task;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onOpenDetail?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { status: task.status },
  });

  return (
    <TaskCard
      ref={setNodeRef}
      task={task}
      onDelete={onDelete}
      onStatusChange={onStatusChange}
      onOpenDetail={onOpenDetail}
      isDragging={isDragging}
      dragHandleProps={{ ...attributes, ...listeners }}
      style={{
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 20 : undefined,
      }}
    />
  );
}
