"use client";
import { useEffect, useId, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  help?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  className?: string;
  /** Contenido opcional antes y después de la etiqueta (punto de color, total). */
  labelPrefix?: ReactNode;
  labelSuffix?: ReactNode;
}

export function NumberField({ label, value, onChange, help, disabled = false, min = 0, max = 150, className, labelPrefix, labelSuffix }: Props) {
  const { t } = useTranslation();
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

  // Los pasos operan sobre el valor confirmado, no sobre el borrador que se esté tipeando.
  const step = (delta: number) => onChange(Math.min(max, Math.max(min, value + delta)));

  return (
    // `flex flex-col` y no `grid`: la columna implícita de un grid se dimensiona
    // por el min-content de sus hijos, y la fila del stepper (dos botones de
    // 44px más el input) desbordaba la tarjeta en pantallas angostas.
    <div className={`flex flex-col gap-2 rounded-3xl border p-4 ${disabled ? "border-slate-200 bg-slate-100/80" : "border-slate-200 bg-white"} ${className ?? ""}`}>
      {/* La etiqueta envuelve en varias líneas: forzarla a una sola (`truncate`)
          le da un ancho mínimo igual al texto completo y desborda la tarjeta en
          pantallas angostas. */}
      <div className="flex items-start justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          {labelPrefix}
          <label htmlFor={id} className="min-w-0 text-sm font-semibold text-slate-900">
            {label}
          </label>
        </span>
        {labelSuffix}
      </div>
      {help && <span className="text-xs leading-5 text-slate-500">{help}</span>}
      {/* Los botones quedan fuera del <label>: dentro, tocarlos enfocaría el input
          y abriría el teclado en móvil, que es justo lo que las flechas evitan. */}
      <div className="flex items-stretch gap-2">
        <StepButton
          label={t("numberField.decrease", { label })}
          disabled={disabled || value <= min}
          onClick={() => step(-1)}
        >
          −
        </StepButton>
        <input
          id={id}
          type="number"
          inputMode="numeric"
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
          className="h-11 min-w-0 flex-1 rounded-2xl border border-slate-300 bg-white px-2 text-center text-base tabular-nums text-slate-950 outline-none transition focus:border-amber-500 disabled:bg-slate-100"
        />
        <StepButton
          label={t("numberField.increase", { label })}
          disabled={disabled || value >= max}
          onClick={() => step(1)}
        >
          +
        </StepButton>
      </div>
    </div>
  );
}

interface StepButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}

function StepButton({ label, disabled, onClick, children }: StepButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="size-11 shrink-0 rounded-2xl border border-slate-300 bg-slate-50 text-xl font-semibold leading-none text-slate-700 transition hover:border-slate-500 hover:bg-slate-100 hover:text-slate-950 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-300 disabled:hover:border-slate-200 disabled:hover:bg-slate-100"
    >
      {children}
    </button>
  );
}
