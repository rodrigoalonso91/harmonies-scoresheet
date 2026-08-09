"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { BoardSide } from "@/types";
import { hasWaterProgress, useActivePlayer, useGameSession } from "@/state";
import { CategoryScoringView } from "../category";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { PlayerScoreSheet } from "../sheet";
import { BoardSideToggle, ConfirmDialog, ScoringModeToggle } from "../ui";
import { AppHeader } from "./AppHeader";
import { PlayerTabs } from "./PlayerTabs";
import { usePlayerName } from "./player-presentation";

type PendingAction = "reset-player" | "new-game" | "board-side";

export function GameSessionScreen() {
  const { t } = useTranslation();
  const { session, dispatch } = useGameSession();
  const { player, boardSide, resetScores, setBoardSide } = useActivePlayer();
  const resolvePlayerName = usePlayerName();
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [pendingBoardSide, setPendingBoardSide] = useState<BoardSide>(boardSide);

  const activeIndex = session.players.findIndex((candidate) => candidate.id === player.id);
  const activeName = resolvePlayerName(player, activeIndex);
  const byPlayer = session.scoringMode === "by-player";

  // Cambiar de lado normaliza el agua de todos: solo se confirma si hay algo que perder.
  const requestBoardSide = (side: BoardSide) => {
    if (side === boardSide) return;

    if (hasWaterProgress(session)) {
      setPendingBoardSide(side);
      setPending("board-side");
      return;
    }

    setBoardSide(side);
  };

  const confirmations = {
    "reset-player": {
      title: t("session.resetPlayerTitle"),
      description: t("session.resetPlayerConfirm", { name: activeName }),
      confirmLabel: t("session.resetPlayer"),
      onConfirm: resetScores,
    },
    "new-game": {
      title: t("session.newGameTitle"),
      description: t("session.newGameConfirm"),
      confirmLabel: t("session.newGame"),
      onConfirm: () => dispatch({ type: "NEW_GAME" }),
    },
    "board-side": {
      title: t("session.boardSideTitle"),
      description: t("session.boardSideConfirm", { side: pendingBoardSide }),
      confirmLabel: t("session.boardSideChange"),
      onConfirm: () => setBoardSide(pendingBoardSide),
    },
  } as const;

  const confirmation = pending ? confirmations[pending] : null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7,#f8fafc_48%,#dbeafe)] px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <AppHeader>
          <LanguageSwitcher />
          <BoardSideToggle side={boardSide} onChange={requestBoardSide} />
          <ScoringModeToggle
            mode={session.scoringMode}
            onChange={(mode) => dispatch({ type: "SET_SCORING_MODE", mode })}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "SET_STATUS", status: "finished" })}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100"
            >
              {t("results.viewResults")}
            </button>
            {/* Reiniciar apunta al jugador activo, un concepto que solo existe
                en el modo por jugador. */}
            {byPlayer && (
              <button
                type="button"
                onClick={() => setPending("reset-player")}
                className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white hover:bg-white/10 hover:text-white"
              >
                {t("session.resetPlayer")}
              </button>
            )}
            <button
              type="button"
              onClick={() => setPending("new-game")}
              className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white hover:bg-white/10 hover:text-white"
            >
              {t("session.newGame")}
            </button>
          </div>
        </AppHeader>

        {byPlayer ? (
          <>
            <PlayerTabs />
            <PlayerScoreSheet />
          </>
        ) : (
          <CategoryScoringView />
        )}
      </div>

      <ConfirmDialog
        open={confirmation !== null}
        title={confirmation?.title ?? ""}
        description={confirmation?.description ?? ""}
        confirmLabel={confirmation?.confirmLabel ?? ""}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          confirmation?.onConfirm();
          setPending(null);
        }}
      />
    </main>
  );
}
