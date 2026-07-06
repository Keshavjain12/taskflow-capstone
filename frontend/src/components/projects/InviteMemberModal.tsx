import { useForm } from "react-hook-form";
import { useAddMember } from "../../hooks/useProjects";
import { Spinner } from "../ui/Spinner";
import { Modal } from "../ui/Modal";

interface InviteMemberForm {
  email: string;
  role: "OWNER" | "MEMBER";
}

export function InviteMemberModal({
  projectId,
  open,
  onClose,
}: {
  projectId: string;
  open: boolean;
  onClose: () => void;
}) {
  const addMember = useAddMember(projectId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberForm>({ defaultValues: { role: "MEMBER" } });

  const onSubmit = handleSubmit((data) => {
    addMember.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  });

  return (
    <Modal open={open} onClose={onClose} title="Invite a member" subtitle="They'll need an existing TaskFlow account.">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="label" htmlFor="invite-email">Email</label>
          <input
            id="invite-email"
            type="email"
            className="input"
            autoFocus
            placeholder="teammate@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="invite-role">Role</label>
          <select id="invite-role" className="input" {...register("role")}>
            <option value="MEMBER">Member</option>
            <option value="OWNER">Owner</option>
          </select>
          <p className="mt-1.5 text-xs text-surface-400">Owners can manage members and delete the project.</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={addMember.isPending}>
            {addMember.isPending && <Spinner className="h-4 w-4" />}
            Send invite
          </button>
        </div>
      </form>
    </Modal>
  );
}
