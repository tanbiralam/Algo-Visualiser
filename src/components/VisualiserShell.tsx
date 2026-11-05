import { ReactNode } from "react";
import { Mark } from "./Mark";
import { ThemeToggle } from "./ThemeToggle";

export type Section = "home" | "sorting" | "pathfinding";

const NAV = [
  { href: "/sorting", label: "Sorting", section: "sorting" },
  { href: "/pathfinding", label: "Pathfinding", section: "pathfinding" },
] as const;

export function SiteHeader({ section }: { section: Section }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 sm:gap-6 lg:px-6">
      {/* Plain links on purpose: a full reload discards any in-flight playback. */}
      <a href="/" className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight">
        <Mark />
        <span className="hidden sm:inline">Algo Visualiser</span>
      </a>
      <nav className="flex gap-1 text-sm">
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            aria-current={section === n.section ? "page" : undefined}
            className="rounded-md px-3 py-1.5 text-muted transition hover:text-ink aria-[current=page]:bg-surface aria-[current=page]:text-ink aria-[current=page]:shadow-[inset_0_0_0_1px_rgb(var(--c-line))]"
          >
            {n.label}
          </a>
        ))}
      </nav>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  );
}

export function Button({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 items-center justify-center gap-2 rounded-md border border-line bg-surface px-3 text-sm text-ink transition hover:border-ink/30 hover:bg-sunk active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function VisualiserShell({
  section,
  controls,
  side,
  footer,
  children,
}: {
  section: Section;
  controls: ReactNode;
  side: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink lg:h-screen">
      <header className="border-b border-line">
        <SiteHeader section={section} />
        <div className="grid grid-cols-2 items-end gap-3 border-t border-line bg-surface/60 px-4 py-3 sm:flex sm:flex-wrap lg:px-6">
          {controls}
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative flex min-h-[55vh] min-w-0 flex-1 p-4 lg:p-6">{children}</div>
        <aside className="w-full space-y-7 overflow-y-auto border-t border-line bg-surface p-4 text-sm lg:w-[400px] lg:border-l lg:border-t-0 lg:p-6">
          {side}
        </aside>
      </main>
      <footer className="sticky bottom-0 border-t border-line bg-surface/95 px-4 py-2 backdrop-blur lg:static lg:px-6">
        {footer}
      </footer>
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{title}</h2>
      {children}
    </section>
  );
}

/** One visualisation with a caption; compare mode shows two. */
export function Pane({
  label,
  status,
  children,
}: {
  label?: string;
  status?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {label && (
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="font-display text-base font-semibold">{label}</span>
          <span className="font-mono text-xs text-muted">{status}</span>
        </div>
      )}
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
