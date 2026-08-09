"use client";
import { useTranslation } from "react-i18next";
import type { ScoringStep } from "@/lib";
import { SCORING_STEP_COUNT } from "@/lib";
import { Token } from "../Token";

interface Props {
  steps: ScoringStep[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

/** Tira de pasos saltable + indicador textual de progreso. */
export function StepNavigator({ steps, activeIndex, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {steps.map((step, index) => {
          const active = index === activeIndex;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-current={active ? "step" : undefined}
              aria-label={t("steps.goToStep", {
                index: index + 1,
                label: t(step.labelKey),
              })}
              className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border transition ${
                active
                  ? "border-slate-950 bg-slate-950 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-400"
              }`}
            >
              <Token kind={step.token} size={24} />
            </button>
          );
        })}
      </div>
      <p className="shrink-0 text-sm font-semibold text-slate-500">
        {t("steps.progress", { current: activeIndex + 1, total: SCORING_STEP_COUNT })}
      </p>
    </div>
  );
}
