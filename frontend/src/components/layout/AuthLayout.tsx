import { ReactNode } from "react";
import { motion } from "framer-motion";
import { IconKanban, IconLayers, IconSparkles, IconUsers } from "../ui/Icons";

const FEATURES = [
  { icon: IconKanban, text: "Real-time Kanban boards that stay in sync across your team" },
  { icon: IconUsers, text: "Role-scoped project membership — owners and members, done right" },
  { icon: IconLayers, text: "One command spins up the full stack: API, database, and UI" },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-full lg:grid-cols-2">
      {/* Brand / storytelling panel */}
      <div className="relative hidden overflow-hidden bg-surface-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-aurora" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 90%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-2.5 font-display text-lg font-bold text-white"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-glow">
            <IconKanban className="h-4.5 w-4.5 text-white" />
          </span>
          TaskFlow
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-md"
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-brand-200">
            <IconSparkles className="h-3.5 w-3.5" />
            Full-stack capstone project
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight text-white xl:text-4xl">
            Ship your team's best work,
            <span className="gradient-text"> one board at a time.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-surface-300">
            TaskFlow is a production-grade project & task manager — JWT auth, Postgres,
            Docker, CI/CD, and a UI that doesn't look like a weekend project.
          </p>

          <ul className="mt-8 space-y-4">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                className="flex items-start gap-3 text-sm text-surface-200"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-brand-300">
                  <f.icon className="h-3.5 w-3.5" />
                </span>
                {f.text}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <p className="relative z-10 text-xs text-surface-500">© 2026 TaskFlow. Built for the capstone showcase.</p>
      </div>

      {/* Form panel */}
      <div className="flex min-h-full items-center justify-center bg-white px-4 py-12 dark:bg-surface-950 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
