"use client";
import { useTranslation } from "react-i18next";
import { calculateScore } from "@/lib";
import { useGameState } from "@/state";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { Section } from "../ui";
import { AppHeader } from "./AppHeader";
import { PLAYER_DOT_CLASS, usePlayerName } from "./player-presentation";

export function ResumePrompt() {
  const { t } = useTranslation();
  const { state, dispatch } = useGameState();
  const resolvePlayerName = usePlayerName();
  const savedSession = state.savedSession;

  if (!savedSession) return null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7,#f8fafc_48%,#dbeafe)] px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <AppHeader>
          <LanguageSwitcher />
        </AppHeader>

        <Section title={t("resume.title")} description={t("resume.description")}>
          <ul className="grid gap-2">
            {savedSession.players.map((player, index) => (
              <li
                key={player.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                  <span
                    aria-hidden
                    className={`size-2.5 rounded-full ${PLAYER_DOT_CLASS[player.color]}`}
                  />
                  {resolvePlayerName(player, index)}
                </span>
                <span className="text-lg font-semibold tabular-nums text-slate-950">
                  {calculateScore(player.sheet, savedSession.boardSide).total}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => dispatch({ type: "RESUME_SAVED" })}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {t("resume.continue")}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "DISCARD_SAVED" })}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
            >
              {t("resume.newGame")}
            </button>
          </div>
        </Section>
      </div>
    </main>
  );
}
