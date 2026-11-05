import { ReactNode } from "react";

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
      className="flex h-9 items-center gap-2 rounded-md border border-white/15 px-3 text-sm text-gray-200 transition hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function VisualiserShell({
  title,
  controls,
  side,
  footer,
  children,
}: {
  title: string;
  controls: ReactNode;
  side: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-gray-300 lg:h-screen">
      <header className="flex flex-wrap items-end gap-3 border-b border-white/10 px-4 py-3">
        {/* Plain link on purpose: a full reload discards any in-flight playback. */}
        <a href="/" className="mr-auto self-center text-xl font-light text-white hover:text-purple-300">
          {title}
        </a>
        {controls}
      </header>
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative flex min-h-[50vh] min-w-0 flex-1 p-4">{children}</div>
        <aside className="w-full space-y-6 overflow-y-auto border-t border-white/10 p-4 text-sm lg:w-96 lg:border-l lg:border-t-0">
          {side}
        </aside>
      </main>
      <footer className="border-t border-white/10 px-4 py-2">{footer}</footer>
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
      {children}
    </section>
  );
}

/** One visualisation with a caption; compare mode shows two side by side. */
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
        <div className="mb-2 flex items-baseline justify-between gap-2 text-xs">
          <span className="font-semibold text-gray-200">{label}</span>
          <span className="text-gray-500">{status}</span>
        </div>
      )}
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
