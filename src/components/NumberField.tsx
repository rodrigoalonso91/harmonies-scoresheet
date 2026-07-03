"use client";
import { useEffect, useId, useState } from "react";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  help?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export function NumberField({ label, value, onChange, help, disabled = false, min = 0, max = 20 }: Props) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = (raw: string) => {
    if (raw === "") {
      onChange(min);
      return;
    }
    const clamped = Math.min(max, Math.max(min, Number(raw)));
    onChange(clamped);
    setDraft(String(clamped));
  };

  return (
    <label htmlFor={id} className={`grid gap-2 rounded-3xl border p-4 ${disabled ? "border-slate-200 bg-slate-100/80" : "border-slate-200 bg-white"}`}>
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      {help && <span className="text-xs leading-5 text-slate-500">{help}</span>}
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={draft}
        disabled={disabled}
        onFocus={(event) => event.target.select()}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          if (next !== "") {
            const parsed = Number(next);
            if (!Number.isNaN(parsed) && parsed >= min && parsed <= max) {
              onChange(parsed);
            }
          }
        }}
        onBlur={(event) => commit(event.target.value)}
        className="h-11 rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-amber-500 disabled:bg-slate-100"
      />
    </label>
  );
}
