import { useForm } from "react-hook-form";
import { useCreateProject } from "../../hooks/useProjects";
import { Spinner } from "../ui/Spinner";
import { Modal } from "../ui/Modal";

interface CreateProjectForm {
  name: string;
  description?: string;
}

export function CreateProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createProject = useCreateProject();
  const { register, handleSubmit, reset } = useForm<CreateProjectForm>();

  const onSubmit = handleSubmit((data) => {
    createProject.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  });

  return (
    <Modal open={open} onClose={onClose} title="New project" subtitle="Give your team something to rally around.">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="label">Name</label>
          <input className="input" autoFocus placeholder="e.g. Website Relaunch" {...register("name", { required: true, minLength: 2 })} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={3} placeholder="What's this project about?" {...register("description")} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={createProject.isPending}>
            {createProject.isPending && <Spinner className="h-4 w-4" />}
            Create project
          </button>
        </div>
      </form>
    </Modal>
  );
}
