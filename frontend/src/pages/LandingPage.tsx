import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconKanban,
  IconLayers,
  IconServer,
  IconShield,
  IconSparkles,
  IconUsers,
} from "../components/ui/Icons";
import { PriorityBadge } from "../components/ui/Badge";

const FEATURES = [
  {
    icon: IconKanban,
    title: "Real-time Kanban boards",
    body: "Drag-and-drop task board with optimistic updates that stay in sync across your whole team.",
  },
  {
    icon: IconUsers,
    title: "Role-scoped membership",
    body: "Owners and members, done right — every project has clear, enforced access boundaries.",
  },
  {
    icon: IconShield,
    title: "Production-grade auth",
    body: "JWT access + refresh tokens, bcrypt hashing, rate limiting, and hardened HTTP headers.",
  },
  {
    icon: IconServer,
    title: "One command to run it all",
    body: "Docker Compose spins up Postgres, the API, and the UI together — no manual setup.",
  },
];

// Real, verifiable facts about this codebase — not traffic/usage numbers,
// since a not-yet-launched capstone project has no real users to count.
const STATS = [
  { value: "19", label: "REST endpoints" },
  { value: "11", label: "automated test suites" },
  { value: "100%", label: "TypeScript" },
  { value: "1", label: "command to run the stack" },
];

const MOCK_COLUMNS = [
  { label: "To do", color: "bg-surface-400", cards: [{ title: "Design database schema", priority: "HIGH" as const }] },
  {
    label: "In progress",
    color: "bg-blue-500",
    cards: [{ title: "Build authentication flow", priority: "HIGH" as const }],
  },
  { label: "Done", color: "bg-emerald-500", cards: [{ title: "Set up CI/CD pipeline", priority: "URGENT" as const }] },
];

export function LandingPage() {
  return (
    <div className="min-h-full overflow-x-hidden bg-surface-950 text-surface-100">
      <div className="pointer-events-none fixed inset-0 bg-aurora" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5 font-display text-base font-bold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient shadow-glow">
            <IconKanban className="h-4 w-4" />
          </span>
          TaskFlow
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/login" className="btn-ghost !text-surface-300 hover:!text-white">
            Log in
          </Link>
          <Link to="/register" className="btn-primary">
            Get started
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10 sm:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-brand-200">
            <IconSparkles className="h-3.5 w-3.5" />
            Full-stack capstone project
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            Ship your team's best work,
            <br />
            <span className="gradient-text">one board at a time.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-surface-300">
            TaskFlow is a production-grade project & task manager built with React, Node.js,
            PostgreSQL, and Docker — real auth, real tests, real CI/CD.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/register" className="btn-primary px-6 py-3 text-base">
              Get started free
            </Link>
            <Link to="/login" className="btn-secondary !border-white/15 !bg-white/5 !text-white px-6 py-3 text-base hover:!bg-white/10">
              I have an account
            </Link>
          </div>

          <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-white">{s.value}</p>
                <p className="mt-0.5 text-xs text-surface-400">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Decorative product preview — a stylized mock of the real board, not a screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="pointer-events-none absolute -inset-8 bg-brand-gradient-soft blur-3xl" />
          <div className="glass relative rounded-2xl border border-white/10 p-3 shadow-glow-lg sm:p-5">
            <div className="mb-3 flex items-center gap-1.5 px-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 text-xs text-surface-400">taskflow.dev/projects/launch</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {MOCK_COLUMNS.map((col) => (
                <div key={col.label} className="rounded-xl bg-surface-900/60 p-2.5">
                  <div className="mb-2 flex items-center gap-1.5 px-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${col.color}`} />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                      {col.label}
                    </span>
                  </div>
                  {col.cards.map((c) => (
                    <div key={c.title} className="rounded-lg border border-surface-800 bg-surface-850 p-2.5">
                      <p className="text-xs font-medium text-surface-100">{c.title}</p>
                      <div className="mt-2">
                        <PriorityBadge priority={c.priority} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-brand-300">
                <f.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-3.5 text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-surface-400">{f.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-1.5 border-t border-white/10 pt-8 text-center text-xs text-surface-500">
          <IconLayers className="h-4 w-4 text-surface-600" />
          <p>&copy; 2026 TaskFlow. Built for the capstone showcase.</p>
        </div>
      </main>
    </div>
  );
}
