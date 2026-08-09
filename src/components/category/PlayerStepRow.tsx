"use client";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Player } from "@/types";
import type { ScoringStep } from "@/lib";
import { useGameSession } from "@/state";
import { NumberStepper } from "../NumberStepper";
import { PLAYER_DOT_CLASS } from "../session/player-presentation";
import type { PlayerRename } from "../session/use-player-rename";

interface Props {
  player: Player;
  name: string;
  total: number;
  step: ScoringStep;
  rename: PlayerRename;
}

/** Tarjeta de un jugador dentro de un paso: nombre editable, total y campo. */
export function PlayerStepRow({ player, name, total, step, rename }: Props) {
  const { t } = useTranslation();
  const { dispatch } = useGameSession();

  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        {rename.isEditing(player.id) ? (
          <input
            type="text"
            aria-label={t("players.rename")}
            placeholder={name}
            {...rename.getInputProps(player)}
            className="h-9 min-w-0 flex-1 rounded-2xl border border-slate-300 px-3 text-sm font-semibold text-slate-950 outline-none focus:border-amber-500"
          />
        ) : (
          <span className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              className={`size-2.5 shrink-0 rounded-full ${PLAYER_DOT_CLASS[player.color]}`}
            />
            <span className="min-w-0 text-sm font-semibold text-slate-900">{name}</span>
            <button
              type="button"
              onClick={() => rename.startEditing(player.id)}
              aria-label={t("players.rename")}
              title={t("players.rename")}
              className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Pencil className="size-3.5" aria-hidden />
            </button>
          </span>
        )}
        <span className="shrink-0 text-base font-bold tabular-nums text-slate-400">{total}</span>
      </div>

      <NumberStepper
        label={name}
        value={step.read(player.sheet)}
        min={step.min}
        onChange={(value) =>
          dispatch({ type: "UPDATE_SHEET", playerId: player.id, patch: step.write(value) })
        }
      />
    </div>
  );
}
