import { IconPlus } from "../ui/Icons";
import type { Project } from "../../api/types";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const GRADIENTS = ["from-brand-500 to-accent-500", "from-sky-500 to-brand-500", "from-emerald-500 to-sky-500", "from-amber-500 to-accent-500"];

export function MemberAvatarStack({
  members,
  onInvite,
}: {
  members: NonNullable<Project["members"]>;
  onInvite: () => void;
}) {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {members.slice(0, 5).map((m, i) => (
          <span
            key={m.id}
            title={`${m.user.name} (${m.role === "OWNER" ? "Owner" : "Member"})`}
            className={`grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-gradient-to-br text-[10px] font-bold text-white dark:border-surface-900 ${GRADIENTS[i % GRADIENTS.length]}`}
          >
            {initials(m.user.name)}
          </span>
        ))}
        {members.length > 5 && (
          <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-surface-200 text-[10px] font-bold text-surface-600 dark:border-surface-900 dark:bg-surface-800 dark:text-surface-300">
            +{members.length - 5}
          </span>
        )}
      </div>
      <button
        onClick={onInvite}
        aria-label="Invite a member"
        title="Invite a member"
        className="ml-2 grid h-8 w-8 place-items-center rounded-full border border-dashed border-surface-300 text-surface-400 transition hover:border-brand-400 hover:text-brand-500 dark:border-surface-700"
      >
        <IconPlus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
