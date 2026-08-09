"use client";
import { useCallback, useMemo } from "react";
import type { BoardSide, Player, PlayerScoreSheetPatch, ScoreBreakdown } from "@/types";
import {
  calculateScore,
  calculateStandings,
  rankPlayers,
  type PlayerStanding,
  type RankedPlayer,
} from "@/lib";
import { useGameSession } from "./use-game-session";

export interface ActivePlayerContext {
  player: Player;
  boardSide: BoardSide;
  score: ScoreBreakdown;
  updateSheet: (patch: PlayerScoreSheetPatch) => void;
  resetScores: () => void;
  setBoardSide: (boardSide: BoardSide) => void;
}

export function useActivePlayer(): ActivePlayerContext {
  const { session, dispatch } = useGameSession();

  // Invariante I2 garantiza que el jugador activo siempre existe.
  const player =
    session.players.find((candidate) => candidate.id === session.activePlayerId) ??
    session.players[0];

  const score = useMemo(
    () => calculateScore(player.sheet, session.boardSide),
    [player.sheet, session.boardSide],
  );

  const updateSheet = useCallback(
    (patch: PlayerScoreSheetPatch) =>
      dispatch({ type: "UPDATE_SHEET", playerId: player.id, patch }),
    [dispatch, player.id],
  );

  const resetScores = useCallback(
    () => dispatch({ type: "RESET_PLAYER_SCORES", playerId: player.id }),
    [dispatch, player.id],
  );

  const setBoardSide = useCallback(
    (boardSide: BoardSide) => dispatch({ type: "SET_BOARD_SIDE", boardSide }),
    [dispatch],
  );

  return { player, boardSide: session.boardSide, score, updateSheet, resetScores, setBoardSide };
}

/** Puntaje de cada jugador en el orden de la mesa, para la barra de pestañas. */
export function usePlayerStandings(): PlayerStanding[] {
  const { session } = useGameSession();

  return useMemo(
    () => calculateStandings(session.players, session.boardSide),
    [session.players, session.boardSide],
  );
}

/** Jugadores ordenados por puntaje, para la pantalla de resultados. */
export function useRankedPlayers(): RankedPlayer[] {
  const { session } = useGameSession();

  return useMemo(
    () => rankPlayers(session.players, session.boardSide),
    [session.players, session.boardSide],
  );
}
