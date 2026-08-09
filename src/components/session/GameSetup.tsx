"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { BoardSide } from "@/types";
import { MAX_PLAYERS } from "@/types";
import { useGameState } from "@/state";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { BoardSideToggle, Section } from "../ui";
import { AppHeader } from "./AppHeader";

const PLAYER_COUNTS = Array.from({ length: MAX_PLAYERS }, (_, index) => index + 1);
const QUICK_START_PLAYERS = 2;

export function GameSetup() {
  const { t } = useTranslation();
  const { dispatch } = useGameState();
  const [playerCount, setPlayerCount] = useState(QUICK_START_PLAYERS);
  const [names, setNames] = useState<string[]>(() => Array(MAX_PLAYERS).fill(""));
  const [boardSide, setBoardSide] = useState<BoardSide>("A");

  const startSession = (count: number, sessionNames: string[], side: BoardSide) =>
    dispatch({ type: "START_SESSION", names: sessionNames.slice(0, count), boardSide: side });

  const updateName = (index: number, name: string) =>
    setNames((current) => current.map((value, position) => (position === index ? name : value)));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7,#f8fafc_48%,#dbeafe)] px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <AppHeader>
          <LanguageSwitcher />
          <BoardSideToggle side={boardSide} onChange={setBoardSide} />
        </AppHeader>

        <Section title={t("setup.title")} description={t("setup.description")}>
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">
              {t("setup.playerCount")}
            </legend>
            <div className="mt-3 inline-flex rounded-full border border-slate-200 bg-white p-1">
              {PLAYER_COUNTS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setPlayerCount(count)}
                  aria-pressed={playerCount === count}
                  className={`w-12 rounded-full py-2 text-sm font-semibold transition ${
                    playerCount === count
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {names.slice(0, playerCount).map((name, index) => (
              <label
                key={index}
                className="grid gap-2 rounded-3xl border border-slate-200 bg-white p-4"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {t("setup.playerName", { index: index + 1 })}
                </span>
                <input
                  type="text"
                  value={name}
                  maxLength={20}
                  placeholder={t("players.defaultName", { index: index + 1 })}
                  onChange={(event) => updateName(index, event.target.value)}
                  className="h-11 rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-amber-500"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => startSession(playerCount, names, boardSide)}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {t("setup.start")}
            </button>
            <button
              type="button"
              onClick={() => startSession(QUICK_START_PLAYERS, Array(MAX_PLAYERS).fill(""), "A")}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
            >
              {t("setup.quickStart")}
            </button>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">{t("setup.quickStartHelp")}</p>
        </Section>
      </div>
    </main>
  );
}
