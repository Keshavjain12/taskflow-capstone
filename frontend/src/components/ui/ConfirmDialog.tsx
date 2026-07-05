import { AnimatePresence, motion } from "framer-motion";
import { IconAlertTriangle } from "./Icons";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-surface-950/50 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="card fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-6"
          >
            {danger && (
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <IconAlertTriangle className="h-5 w-5" />
              </div>
            )}
            <h2 id="confirm-dialog-title" className="text-base font-semibold text-surface-900 dark:text-surface-100">
              {title}
            </h2>
            {description && <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{description}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
