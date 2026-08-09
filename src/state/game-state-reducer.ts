import type { BoardSide, GameSession } from "@/types";
import {
  createGameSession,
  gameSessionReducer,
  type SessionAction,
} from "./game-session-reducer";

/**
 * Estado de la app por encima de la partida:
 * - `hydrated` false hasta leer `localStorage` en el cliente (evita mismatch de SSR).
 * - `session` null significa "mostrar el setup".
 * - `savedSession` es la partida guardada que se le ofrece continuar al anfitrión.
 */
export interface GameState {
  hydrated: boolean;
  session: GameSession | null;
  savedSession: GameSession | null;
}

export type GameStateAction =
  | { type: "HYDRATE"; savedSession: GameSession | null }
  | { type: "RESUME_SAVED" }
  | { type: "DISCARD_SAVED" }
  | { type: "START_SESSION"; names: string[]; boardSide: BoardSide }
  | { type: "NEW_GAME" }
  | SessionAction;

export const INITIAL_GAME_STATE: GameState = {
  hydrated: false,
  session: null,
  savedSession: null,
};

export function gameStateReducer(state: GameState, action: GameStateAction): GameState {
  switch (action.type) {
    case "HYDRATE":
      // Se ofrece continuar cualquier partida guardada, incluida una en la
      // pantalla de resultados: desde ahí todavía se puede volver a corregir
      // puntajes, así que descartarla perdería datos.
      return { hydrated: true, session: null, savedSession: action.savedSession };

    case "RESUME_SAVED":
      if (!state.savedSession) return state;
      return { ...state, session: state.savedSession, savedSession: null };

    case "DISCARD_SAVED":
      return { ...state, session: null, savedSession: null };

    case "START_SESSION":
      return {
        ...state,
        session: createGameSession(action.names, action.boardSide),
        savedSession: null,
      };

    case "NEW_GAME":
      return { ...state, session: null, savedSession: null };

    default: {
      if (!state.session) return state;

      const session = gameSessionReducer(state.session, action);
      return session === state.session ? state : { ...state, session };
    }
  }
}
