import { useId } from "react";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  help?: string;
  disabled?: boolean;
  min?: number;
}

export function NumberField({
  label,
  value,
  onChange,
  help,
  disabled = false,
  min = 0,
}: Props) {
  const id = useId();

  return (
    <label htmlFor={id} className={`grid gap-2 rounded-3xl border p-4 ${disabled ? "border-slate-200 bg-slate-100/80" : "border-slate-200 bg-white"}`}>
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      {help && <span className="text-xs leading-5 text-slate-500">{help}</span>}
      <input
        id={id}
        type="number"
        min={min}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Math.max(min, Number(event.target.value) || 0))}
        className="h-11 rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-amber-500 disabled:bg-slate-100"
      />
    </label>
  );
}
