"use client";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { Player, PlayerColor } from "@/types";

/** Clases estáticas: Tailwind no puede resolver nombres de clase interpolados. */
export const PLAYER_DOT_CLASS: Record<PlayerColor, string> = {
  teal: "bg-teal-400",
  amber: "bg-amber-400",
  rose: "bg-rose-400",
  violet: "bg-violet-400",
};

export type ResolvePlayerName = (player: Player, index: number) => string;

/**
 * Un nombre vacío significa "usar el por defecto", que se resuelve acá para que
 * siga el idioma activo en vez de quedar congelado al crear el jugador.
 */
export function usePlayerName(): ResolvePlayerName {
  const { t } = useTranslation();

  return useCallback(
    (player: Player, index: number) =>
      player.name.trim() || t("players.defaultName", { index: index + 1 }),
    [t],
  );
}
