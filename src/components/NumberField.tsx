"use client";
import { useId } from "react";
import { NumberStepper } from "./NumberStepper";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  help?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

/** Campo de puntaje con etiqueta y ayuda. Para filas que ya muestran su propio
 *  encabezado (modo por categoría) usar `NumberStepper` directamente. */
export function NumberField({
  label,
  value,
  onChange,
  help,
  disabled = false,
  min = 0,
  max = 150,
  className,
}: Props) {
  const id = useId();

  return (
    // `flex flex-col` y no `grid`: la columna implícita de un grid se dimensiona
    // por el min-content de sus hijos, y la fila del stepper (dos botones de
    // 44px más el input) desbordaba la tarjeta en pantallas angostas.
    <div
      className={`flex flex-col gap-2 rounded-3xl border p-4 ${disabled ? "border-slate-200 bg-slate-100/80" : "border-slate-200 bg-white"} ${className ?? ""}`}
    >
      {/* Sin `truncate`: forzar la etiqueta a una sola línea le da un ancho
          mínimo igual al texto completo y desborda la tarjeta en pantallas
          angostas. */}
      <label htmlFor={id} className="min-w-0 text-sm font-semibold text-slate-900">
        {label}
      </label>
      {help && <span className="text-xs leading-5 text-slate-500">{help}</span>}
      <NumberStepper
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        max={max}
      />
    </div>
  );
}
