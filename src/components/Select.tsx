import { BsChevronDown } from "react-icons/bs";

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{label}</span>
      <span className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as T)}
          className="h-9 w-full cursor-pointer appearance-none truncate rounded-md border border-line bg-surface pl-3 pr-8 text-sm text-ink transition hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[10rem]"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <BsChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" />
      </span>
    </label>
  );
}
