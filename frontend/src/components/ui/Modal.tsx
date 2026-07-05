import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { IconX } from "./Icons";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: "md" | "lg";
}

const SIZE_CLASS: Record<"md" | "lg", string> = {
  md: "max-w-md",
  lg: "max-w-xl",
};

export function Modal({ open, onClose, title, subtitle, children, size = "md" }: ModalProps) {
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
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`card fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-full ${SIZE_CLASS[size]} -translate-x-1/2 -translate-y-1/2 overflow-y-auto p-6 sm:p-7`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="modal-title" className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  {title}
                </h2>
                {subtitle && <p className="mt-0.5 text-sm text-surface-500 dark:text-surface-400">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-surface-400 transition hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-200"
              >
                <IconX className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="mt-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
