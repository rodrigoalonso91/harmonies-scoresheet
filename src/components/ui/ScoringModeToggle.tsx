"use client";
import { useTranslation } from "react-i18next";
import type { ScoringMode } from "@/types";

interface Props {
  mode: ScoringMode;
  onChange: (mode: ScoringMode) => void;
}

const MODES: { value: ScoringMode; labelKey: string }[] = [
  { value: "by-player", labelKey: "scoringMode.byPlayer" },
  { value: "by-category", labelKey: "scoringMode.byCategory" },
];

export function ScoringModeToggle({ mode, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className="inline-flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur"
      role="group"
      aria-label={t("scoringMode.label")}
    >
      {MODES.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={mode === option.value}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === option.value
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-200 hover:text-white"
          }`}
        >
          {t(option.labelKey)}
        </button>
      ))}
    </div>
  );
}
