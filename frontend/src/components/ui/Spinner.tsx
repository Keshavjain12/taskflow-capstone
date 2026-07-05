import clsx from "clsx";

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={clsx("animate-spin", className ?? "h-4 w-4")}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function PageSpinner() {
  return (
    <div className="flex h-full min-h-[40vh] items-center justify-center">
      <Spinner className="h-7 w-7 text-brand-500" />
    </div>
  );
}
