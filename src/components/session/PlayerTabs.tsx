"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_PLAYERS } from "@/types";
import { useGameSession, usePlayerStandings } from "@/state";
import { ConfirmDialog } from "../ui";
import { PLAYER_DOT_CLASS, usePlayerName } from "./player-presentation";

export function PlayerTabs() {
  const { t } = useTranslation();
  const { session, dispatch } = useGameSession();
  const standings = usePlayerStandings();
  const resolvePlayerName = usePlayerName();
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);

  const pendingRemovalIndex = session.players.findIndex(
    (player) => player.id === pendingRemovalId,
  );
  const pendingRemoval = pendingRemovalIndex === -1 ? null : session.players[pendingRemovalIndex];

  return (
    <div className="sticky top-4 z-20">
      <div className="flex items-center gap-2 overflow-x-auto rounded-3xl border border-white/10 bg-[linear-gradient(155deg,#0a1e31,#102f47_58%,#0b2036)] p-2 shadow-[0_18px_50px_rgba(8,20,35,0.35)]">
        {standings.map(({ player, score }, index) => {
          const active = player.id === session.activePlayerId;
          const name = resolvePlayerName(player, index);

          if (active && editingPlayerId === player.id) {
            return (
              <input
                key={player.id}
                autoFocus
                type="text"
                maxLength={20}
                defaultValue={player.name}
                placeholder={name}
                aria-label={t("players.rename")}
                onBlur={(event) => {
                  dispatch({
                    type: "RENAME_PLAYER",
                    playerId: player.id,
                    name: event.target.value,
                  });
                  setEditingPlayerId(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                  if (event.key === "Escape") setEditingPlayerId(null);
                }}
                className="h-10 w-40 shrink-0 rounded-2xl border border-white bg-white px-3 text-sm font-semibold text-slate-950 outline-none"
              />
            );
          }

          return (
            <div
              key={player.id}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 transition ${
                active ? "bg-white text-slate-950 shadow-sm" : "bg-white/5 text-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  active
                    ? setEditingPlayerId(player.id)
                    : dispatch({ type: "SET_ACTIVE_PLAYER", playerId: player.id })
                }
                aria-current={active ? "true" : undefined}
                title={active ? t("players.rename") : undefined}
                className="flex items-center gap-2"
              >
                <span
                  aria-hidden
                  className={`size-2.5 rounded-full ${PLAYER_DOT_CLASS[player.color]}`}
                />
                <span className="text-sm font-semibold">{name}</span>
                <span className="text-base font-bold tabular-nums">{score.total}</span>
              </button>

              {active && session.players.length > 1 && (
                <button
                  type="button"
                  onClick={() => setPendingRemovalId(player.id)}
                  aria-label={t("players.remove")}
                  title={t("players.remove")}
                  className="rounded-full px-1 text-lg leading-none text-slate-400 transition hover:text-rose-600"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}

        {session.players.length < MAX_PLAYERS && (
          <button
            type="button"
            onClick={() => dispatch({ type: "ADD_PLAYER" })}
            aria-label={t("players.add")}
            title={t("players.add")}
            className="ml-auto shrink-0 rounded-2xl border border-white/25 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-white hover:bg-white/10"
          >
            +
          </button>
        )}
      </div>

      <ConfirmDialog
        open={pendingRemoval !== null}
        title={t("players.removeTitle")}
        description={t("players.removeConfirm", {
          name: pendingRemoval ? resolvePlayerName(pendingRemoval, pendingRemovalIndex) : "",
        })}
        confirmLabel={t("players.remove")}
        onCancel={() => setPendingRemovalId(null)}
        onConfirm={() => {
          if (pendingRemovalId) dispatch({ type: "REMOVE_PLAYER", playerId: pendingRemovalId });
          setPendingRemovalId(null);
        }}
      />
    </div>
  );
}
