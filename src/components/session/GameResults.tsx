"use client";
import { useTranslation } from "react-i18next";
import type { ScoreBreakdown } from "@/types";
import { useGameSession, useRankedPlayers } from "@/state";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { Section } from "../ui";
import { AppHeader } from "./AppHeader";
import { PLAYER_DOT_CLASS, usePlayerName } from "./player-presentation";

interface CategoryRow {
  labelKey: string;
  value: (score: ScoreBreakdown) => number;
  emphasized?: boolean;
}

const CATEGORY_ROWS: CategoryRow[] = [
  { labelKey: "totals.trees", value: (score) => score.landscapes.trees },
  { labelKey: "totals.mountains", value: (score) => score.landscapes.mountains },
  { labelKey: "totals.fields", value: (score) => score.landscapes.fields },
  { labelKey: "totals.water", value: (score) => score.landscapes.water },
  { labelKey: "totals.buildings", value: (score) => score.landscapes.buildings },
  { labelKey: "totals.landscapes", value: (score) => score.landscapes.total, emphasized: true },
  { labelKey: "totals.animalCards", value: (score) => score.animals },
  { labelKey: "totals.natureSpirit", value: (score) => score.natureSpirits },
  { labelKey: "totals.grandTotal", value: (score) => score.total, emphasized: true },
];

export function GameResults() {
  const { t } = useTranslation();
  const { session, dispatch } = useGameSession();
  const ranked = useRankedPlayers();
  const resolvePlayerName = usePlayerName();

  // El nombre por defecto depende de la posición en la mesa, no del ranking.
  const nameOf = (playerId: string) => {
    const index = session.players.findIndex((player) => player.id === playerId);
    return resolvePlayerName(session.players[index], index);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7,#f8fafc_48%,#dbeafe)] px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <AppHeader>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_STATUS", status: "scoring" })}
            className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white hover:bg-white/10 hover:text-white"
          >
            {t("results.backToScoring")}
          </button>
        </AppHeader>

        <Section title={t("results.title")} description={t("results.description")}>
          <ol className="grid gap-2">
            {ranked.map(({ player, score, position, tied }) => {
              const winner = position === 1;

              return (
                <li
                  key={player.id}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3 ${
                    winner
                      ? "bg-linear-to-r from-amber-300 via-orange-400 to-rose-500 text-slate-950 shadow-[0_10px_30px_rgba(244,114,102,0.3)]"
                      : "border border-slate-200 bg-white"
                  }`}
                >
                  <span
                    className={`w-8 shrink-0 text-lg font-bold tabular-nums ${
                      winner ? "text-slate-950" : "text-slate-400"
                    }`}
                  >
                    {position}º
                  </span>
                  <span
                    aria-hidden
                    className={`size-2.5 shrink-0 rounded-full ${PLAYER_DOT_CLASS[player.color]}`}
                  />
                  <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <span className="truncate font-semibold">{nameOf(player.id)}</span>
                    {winner && !tied && (
                      <span className="rounded-full bg-slate-950/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
                        {t("results.winner")}
                      </span>
                    )}
                    {tied && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                          winner ? "bg-slate-950/15" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {t("results.tie")}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xl font-bold tabular-nums">{score.total}</span>
                </li>
              );
            })}
          </ol>
        </Section>

        <Section title={t("results.breakdownTitle")} description={t("results.breakdownDescription")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 bg-white/80 px-3 py-2 text-left font-semibold text-slate-500 backdrop-blur"
                  >
                    {t("results.category")}
                  </th>
                  {ranked.map(({ player }) => (
                    <th
                      key={player.id}
                      scope="col"
                      className="px-3 py-2 text-right font-semibold text-slate-900"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden
                          className={`size-2 rounded-full ${PLAYER_DOT_CLASS[player.color]}`}
                        />
                        {nameOf(player.id)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATEGORY_ROWS.map((row) => (
                  <tr key={row.labelKey}>
                    <th
                      scope="row"
                      className={`sticky left-0 z-10 border-t border-slate-200 bg-white/80 px-3 py-2 text-left backdrop-blur ${
                        row.emphasized ? "font-semibold text-slate-950" : "text-slate-500"
                      }`}
                    >
                      {t(row.labelKey)}
                    </th>
                    {ranked.map(({ player, score }) => (
                      <td
                        key={player.id}
                        className={`border-t border-slate-200 px-3 py-2 text-right tabular-nums ${
                          row.emphasized ? "font-bold text-slate-950" : "text-slate-700"
                        }`}
                      >
                        {row.value(score)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </main>
  );
}
