import { useForm } from "react-hook-form";
import { useCreateTask } from "../../hooks/useTasks";
import { Spinner } from "../ui/Spinner";
import { Modal } from "../ui/Modal";
import type { TaskPriority } from "../../api/types";

interface CreateTaskForm {
  title: string;
  description?: string;
  priority: TaskPriority;
}

export function CreateTaskModal({
  projectId,
  open,
  onClose,
}: {
  projectId: string;
  open: boolean;
  onClose: () => void;
}) {
  const createTask = useCreateTask(projectId);
  const { register, handleSubmit, reset } = useForm<CreateTaskForm>({
    defaultValues: { priority: "MEDIUM" },
  });

  const onSubmit = handleSubmit((data) => {
    createTask.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  });

  return (
    <Modal open={open} onClose={onClose} title="New task" subtitle="Break the work down into something shippable.">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="label">Title</label>
          <input className="input" autoFocus placeholder="e.g. Wire up the login form" {...register("title", { required: true, minLength: 2 })} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={3} placeholder="Add any useful context" {...register("description")} />
        </div>
        <div>
          <label className="label">Priority</label>
          <select className="input" {...register("priority")}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={createTask.isPending}>
            {createTask.isPending && <Spinner className="h-4 w-4" />}
            Create task
          </button>
        </div>
      </form>
    </Modal>
  );
}
