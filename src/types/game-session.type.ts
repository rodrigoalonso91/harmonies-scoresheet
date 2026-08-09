import type { BoardSide, PlayerScoreSheet } from "./score-sheet.type";

export const MAX_PLAYERS = 4;

export const PLAYER_COLORS = ["teal", "amber", "rose", "violet"] as const;
export type PlayerColor = (typeof PLAYER_COLORS)[number];

export interface Player {
  id: string;
  /**
   * Nombre elegido por el anfitrión. Vacío significa "usar el nombre por defecto",
   * que se resuelve en la capa de UI para poder traducirlo.
   */
  name: string;
  color: PlayerColor;
  sheet: PlayerScoreSheet;
}

export type SessionStatus = "setup" | "scoring" | "finished";

export interface GameSession {
  id: string;
  schemaVersion: number;
  boardSide: BoardSide;
  /** Invariante I1: entre 1 y MAX_PLAYERS jugadores. */
  players: Player[];
  /** Invariante I2: siempre referencia a un jugador existente. */
  activePlayerId: string;
  status: SessionStatus;
  createdAt: number;
  updatedAt: number;
}
