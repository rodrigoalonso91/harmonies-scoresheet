"use client";
import { useTranslation } from "react-i18next";
import type { BoardSide } from "@/types";

interface Props {
  side: BoardSide;
  onChange: (side: BoardSide) => void;
}

export function BoardSideToggle({ side, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur">
      {(["A", "B"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
            side === option
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-200 hover:text-white"
          }`}
        >
          {t("header.boardSide", { side: option })}
        </button>
      ))}
    </div>
  );
}
