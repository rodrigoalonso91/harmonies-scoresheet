import type { GameSession } from "@/types";
import { MAX_PLAYERS } from "@/types";
import { SESSION_SCHEMA_VERSION } from "./game-session-reducer";

const STORAGE_KEY = "harmonies-points:session";

/**
 * Validación defensiva: una sesión de otra `schemaVersion`, corrupta o escrita a
 * mano se descarta en silencio y la app arranca en el setup.
 */
function isValidSession(candidate: unknown): candidate is GameSession {
  if (typeof candidate !== "object" || candidate === null) return false;

  const session = candidate as Partial<GameSession>;

  return (
    session.schemaVersion === SESSION_SCHEMA_VERSION &&
    typeof session.id === "string" &&
    (session.boardSide === "A" || session.boardSide === "B") &&
    Array.isArray(session.players) &&
    session.players.length > 0 &&
    session.players.length <= MAX_PLAYERS &&
    session.players.every((player) => typeof player?.id === "string" && !!player?.sheet) &&
    typeof session.activePlayerId === "string" &&
    session.players.some((player) => player.id === session.activePlayerId)
  );
}

export function loadSession(): GameSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    return isValidSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSession(session: GameSession): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Sin localStorage (modo privado restrictivo, cuota llena) la app sigue
    // funcionando; solo se pierde la persistencia.
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ver saveSession.
  }
}
