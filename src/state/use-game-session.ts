"use client";
import { useContext } from "react";
import type { GameSession } from "@/types";
import { GameSessionContext, type GameSessionContextValue } from "./GameSessionProvider";

export function useGameState(): GameSessionContextValue {
  const context = useContext(GameSessionContext);

  if (!context) {
    throw new Error("useGameState must be used inside a GameSessionProvider");
  }

  return context;
}

/** Para las pantallas que solo se renderizan con una partida en curso. */
export function useGameSession(): {
  session: GameSession;
  dispatch: GameSessionContextValue["dispatch"];
} {
  const { state, dispatch } = useGameState();

  if (!state.session) {
    throw new Error("useGameSession requires an active session");
  }

  return { session: state.session, dispatch };
}
