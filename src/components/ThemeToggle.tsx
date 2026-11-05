"use client";

import { useEffect, useState } from "react";
import { BsCircleHalf, BsMoon, BsSun } from "react-icons/bs";

type Theme = "system" | "light" | "dark";
const OPTIONS = [
  { value: "system", label: "Match system", Icon: BsCircleHalf },
  { value: "light", label: "Light", Icon: BsSun },
  { value: "dark", label: "Dark", Icon: BsMoon },
] as const;

/** Auto / light / dark. The choice is saved in the browser and applied before paint by layout.tsx. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  const choose = (t: Theme) => {
    setTheme(t);
    const root = document.documentElement;
    if (t === "system") delete root.dataset.theme;
    else root.dataset.theme = t;
    try {
      if (t === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", t);
    } catch {
      // storage can be blocked; the choice still applies to this page
    }
  };

  return (
    <div role="group" aria-label="Theme" className="flex rounded-full border border-line bg-surface p-0.5">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          title={label}
          aria-pressed={theme === value}
          onClick={() => choose(value)}
          className="grid h-7 w-7 place-items-center rounded-full text-muted transition hover:text-ink aria-pressed:bg-ink aria-pressed:text-bg"
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
