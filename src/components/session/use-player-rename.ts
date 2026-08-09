"use client";
import { useCallback, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import type { Player } from "@/types";
import { useGameSession } from "@/state";

const MAX_NAME_LENGTH = 20;

export interface PlayerRenameInputProps {
  autoFocus: true;
  defaultValue: string;
  maxLength: number;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export interface PlayerRename {
  editingPlayerId: string | null;
  isEditing: (playerId: string) => boolean;
  startEditing: (playerId: string) => void;
  /** Props del input de edición: confirma con Enter o al salir, cancela con Escape. */
  getInputProps: (player: Player) => PlayerRenameInputProps;
}

/**
 * Edición del nombre de un jugador, compartida por la barra de pestañas y las
 * tarjetas del modo por categoría.
 */
export function usePlayerRename(): PlayerRename {
  const { dispatch } = useGameSession();
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  // Escape provoca el blur del input; sin esta marca el blur confirmaría igual.
  const cancelled = useRef(false);

  const startEditing = useCallback((playerId: string) => {
    cancelled.current = false;
    setEditingPlayerId(playerId);
  }, []);

  const getInputProps = useCallback(
    (player: Player): PlayerRenameInputProps => ({
      autoFocus: true,
      defaultValue: player.name,
      maxLength: MAX_NAME_LENGTH,
      onBlur: (event) => {
        if (!cancelled.current) {
          dispatch({ type: "RENAME_PLAYER", playerId: player.id, name: event.target.value });
        }
        cancelled.current = false;
        setEditingPlayerId(null);
      },
      onKeyDown: (event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") {
          cancelled.current = true;
          event.currentTarget.blur();
        }
      },
    }),
    [dispatch],
  );

  const isEditing = useCallback(
    (playerId: string) => editingPlayerId === playerId,
    [editingPlayerId],
  );

  return { editingPlayerId, isEditing, startEditing, getInputProps };
}
