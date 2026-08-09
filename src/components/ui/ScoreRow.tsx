interface Props {
  label: string;
  value: number;
  emphasized?: boolean;
  grand?: boolean;
}

export function ScoreRow({ label, value, emphasized = false, grand = false }: Props) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
        grand
          ? "bg-linear-to-r from-amber-300 via-orange-400 to-rose-500 text-slate-950 shadow-[0_10px_30px_rgba(244,114,102,0.3)]"
          : emphasized
            ? "bg-white/10 text-white ring-1 ring-inset ring-white/15"
            : "bg-white/5 text-slate-200"
      }`}
    >
      <dt
        className={`text-sm ${grand ? "font-semibold" : emphasized ? "font-semibold text-white" : "text-slate-300"}`}
      >
        {label}
      </dt>
      <dd
        className={`tabular-nums ${grand ? "text-xl font-bold" : "text-lg font-semibold"}`}
      >
        {value}
      </dd>
    </div>
  );
}
