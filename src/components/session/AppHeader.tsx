"use client";
import type { PropsWithChildren } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import harmoniesLogo from "@/assets/harmonies-logo.png";

/** Cabecera compartida por el setup y la pantalla de puntuación. */
export function AppHeader({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  return (
    <header className="relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_15%_-25%,#1f6b82,transparent_55%),radial-gradient(circle_at_115%_5%,#2c4d80,transparent_50%),linear-gradient(155deg,#0a1e31,#102f47_58%,#0b2036)] p-8 text-white shadow-[0_28px_90px_rgba(8,20,35,0.45)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-cyan-400/10 blur-3xl"
      />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="w-56 md:w-72">
            <Image
              src={harmoniesLogo}
              alt={t("header.logoAlt")}
              priority
              className="h-auto w-full drop-shadow-[0_4px_18px_rgba(4,12,24,0.6)]"
            />
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-200/80">
            {t("header.subtitle")}
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-300">{t("header.intro")}</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">{children}</div>
      </div>
    </header>
  );
}
