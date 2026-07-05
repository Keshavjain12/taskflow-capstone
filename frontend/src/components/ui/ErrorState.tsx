import { IconAlertTriangle } from "./Icons";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200/70 bg-red-50/60 p-10 text-center dark:border-red-500/20 dark:bg-red-500/[0.06]">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
        <IconAlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-red-600/90 dark:text-red-400/90">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-4">
          Try again
        </button>
      )}
    </div>
  );
}
