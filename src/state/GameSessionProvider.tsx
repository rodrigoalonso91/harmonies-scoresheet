"use client";
import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from "react";
import {
  gameStateReducer,
  INITIAL_GAME_STATE,
  type GameState,
  type GameStateAction,
} from "./game-state-reducer";
import { clearSession, loadSession, saveSession } from "./session-storage";

const PERSIST_DEBOUNCE_MS = 300;

export interface GameSessionContextValue {
  state: GameState;
  dispatch: Dispatch<GameStateAction>;
}

export const GameSessionContext = createContext<GameSessionContextValue | null>(null);

export function GameSessionProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(gameStateReducer, INITIAL_GAME_STATE);

  // La lectura ocurre solo en el cliente: el servidor no tiene localStorage.
  useEffect(() => {
    dispatch({ type: "HYDRATE", savedSession: loadSession() });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;

    const timeout = setTimeout(() => {
      if (state.session) {
        saveSession(state.session);
      } else if (!state.savedSession) {
        // Sin partida activa ni partida ofrecida para continuar: no queda nada que guardar.
        clearSession();
      }
    }, PERSIST_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [state.hydrated, state.session, state.savedSession]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <GameSessionContext value={value}>{children}</GameSessionContext>;
}
