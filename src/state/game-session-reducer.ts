import type {
  BoardSide,
  GameSession,
  Player,
  PlayerColor,
  PlayerScoreSheet,
  PlayerScoreSheetPatch,
  SessionStatus,
} from "@/types";
import { MAX_PLAYERS, PLAYER_COLORS } from "@/types";
import { createInitialSheet, normalizeWaterForSide } from "@/lib";

export const SESSION_SCHEMA_VERSION = 1;

/** Acciones que operan sobre una partida ya iniciada. */
export type SessionAction =
  | { type: "ADD_PLAYER" }
  | { type: "REMOVE_PLAYER"; playerId: string }
  | { type: "RENAME_PLAYER"; playerId: string; name: string }
  | { type: "SET_ACTIVE_PLAYER"; playerId: string }
  | { type: "SET_BOARD_SIDE"; boardSide: BoardSide }
  | { type: "UPDATE_SHEET"; playerId: string; patch: PlayerScoreSheetPatch }
  | { type: "RESET_PLAYER_SCORES"; playerId: string }
  | { type: "SET_STATUS"; status: SessionStatus };

/** Invariante I3: los colores son únicos dentro de la sesión. */
function nextAvailableColor(players: Player[]): PlayerColor {
  const taken = new Set(players.map((player) => player.color));
  return PLAYER_COLORS.find((color) => !taken.has(color)) ?? PLAYER_COLORS[0];
}

export function createPlayer(
  boardSide: BoardSide,
  players: Player[] = [],
  name = "",
): Player {
  return {
    id: crypto.randomUUID(),
    name,
    color: nextAvailableColor(players),
    sheet: createInitialSheet(boardSide),
  };
}

/**
 * Crea una partida. `names` define la cantidad de jugadores (invariante I1);
 * un nombre vacío se resuelve al nombre por defecto en la capa de UI.
 */
export function createGameSession(names: string[], boardSide: BoardSide): GameSession {
  const requested = names.length === 0 ? [""] : names.slice(0, MAX_PLAYERS);
  const players = requested.reduce<Player[]>(
    (created, name) => [...created, createPlayer(boardSide, created, name.trim())],
    [],
  );
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    schemaVersion: SESSION_SCHEMA_VERSION,
    boardSide,
    players,
    activePlayerId: players[0].id,
    status: "scoring",
    createdAt: now,
    updatedAt: now,
  };
}

function applyPatch(sheet: PlayerScoreSheet, patch: PlayerScoreSheetPatch): PlayerScoreSheet {
  return {
    ...sheet,
    ...patch,
    trees: patch.trees ? { ...sheet.trees, ...patch.trees } : sheet.trees,
    mountains: patch.mountains ? { ...sheet.mountains, ...patch.mountains } : sheet.mountains,
    water: patch.water ? { ...sheet.water, ...patch.water } : sheet.water,
  };
}

function mapPlayer(
  session: GameSession,
  playerId: string,
  update: (player: Player) => Player,
): Player[] {
  return session.players.map((player) => (player.id === playerId ? update(player) : player));
}

/**
 * Invariante I2: al eliminar el jugador activo pasa a estar activo el anterior
 * de la lista, o el primero si el eliminado era el primero.
 */
function resolveActivePlayerId(
  session: GameSession,
  remaining: Player[],
  removedIndex: number,
): string {
  if (session.activePlayerId !== session.players[removedIndex]?.id) {
    return session.activePlayerId;
  }

  const fallback = remaining[Math.max(0, removedIndex - 1)] ?? remaining[0];
  return fallback.id;
}

function reduce(session: GameSession, action: SessionAction): GameSession {
  switch (action.type) {
    case "ADD_PLAYER": {
      // Invariante I1: máximo MAX_PLAYERS jugadores.
      if (session.players.length >= MAX_PLAYERS) return session;

      const player = createPlayer(session.boardSide, session.players);
      return {
        ...session,
        players: [...session.players, player],
        activePlayerId: player.id,
      };
    }

    case "REMOVE_PLAYER": {
      // Invariante I1: nunca se queda sin jugadores.
      if (session.players.length <= 1) return session;

      const removedIndex = session.players.findIndex((player) => player.id === action.playerId);
      if (removedIndex === -1) return session;

      const players = session.players.filter((player) => player.id !== action.playerId);
      return {
        ...session,
        players,
        activePlayerId: resolveActivePlayerId(session, players, removedIndex),
      };
    }

    case "RENAME_PLAYER":
      return {
        ...session,
        players: mapPlayer(session, action.playerId, (player) => ({
          ...player,
          name: action.name,
        })),
      };

    case "SET_ACTIVE_PLAYER": {
      // Invariante I2: solo se activa un jugador existente.
      if (!session.players.some((player) => player.id === action.playerId)) return session;
      return { ...session, activePlayerId: action.playerId };
    }

    case "SET_BOARD_SIDE": {
      if (session.boardSide === action.boardSide) return session;

      // Invariante I4/I5: el lado es único y normaliza el agua de todos los jugadores.
      return {
        ...session,
        boardSide: action.boardSide,
        players: session.players.map((player) => ({
          ...player,
          sheet: {
            ...player.sheet,
            water: normalizeWaterForSide(player.sheet.water, action.boardSide),
          },
        })),
      };
    }

    case "UPDATE_SHEET":
      return {
        ...session,
        players: mapPlayer(session, action.playerId, (player) => ({
          ...player,
          sheet: applyPatch(player.sheet, action.patch),
        })),
      };

    case "RESET_PLAYER_SCORES":
      return {
        ...session,
        players: mapPlayer(session, action.playerId, (player) => ({
          ...player,
          sheet: createInitialSheet(session.boardSide),
        })),
      };

    case "SET_STATUS":
      return session.status === action.status ? session : { ...session, status: action.status };
  }
}

export function gameSessionReducer(session: GameSession, action: SessionAction): GameSession {
  const next = reduce(session, action);
  return next === session ? session : { ...next, updatedAt: Date.now() };
}

/** Hay datos de agua que se perderían al cambiar de lado del tablero. */
export function hasWaterProgress(session: GameSession): boolean {
  return session.players.some(
    (player) => player.sheet.water.longestRiver > 0 || player.sheet.water.islandCount > 1,
  );
}
