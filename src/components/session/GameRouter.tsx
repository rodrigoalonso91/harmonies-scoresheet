"use client";
import { useGameState } from "@/state";
import { GameResults } from "./GameResults";
import { GameSessionScreen } from "./GameSessionScreen";
import { GameSetup } from "./GameSetup";
import { ResumePrompt } from "./ResumePrompt";

/** Elige la pantalla según el estado de la app. */
export function GameRouter() {
  const { state } = useGameState();

  // Hasta leer localStorage no se sabe qué pantalla corresponde. Se renderiza el
  // fondo vacío para que el servidor y el cliente coincidan.
  if (!state.hydrated) {
    return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7,#f8fafc_48%,#dbeafe)]" />;
  }

  if (state.session) {
    return state.session.status === "finished" ? <GameResults /> : <GameSessionScreen />;
  }

  if (state.savedSession) return <ResumePrompt />;

  return <GameSetup />;
}
