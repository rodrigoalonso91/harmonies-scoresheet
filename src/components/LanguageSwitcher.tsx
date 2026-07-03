"use client";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/i18n/config";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const activeLanguage = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div
      className="inline-flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur"
      role="group"
      aria-label={t("languageSwitcher.label")}
    >
      {SUPPORTED_LANGUAGES.map((language) => {
        const active = activeLanguage === language;
        return (
          <button
            key={language}
            type="button"
            onClick={() => i18n.changeLanguage(language)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              active
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-200 hover:text-white"
            }`}
          >
            {language}
          </button>
        );
      })}
    </div>
  );
}
