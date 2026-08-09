"use client";
import { useTranslation } from "react-i18next";
import { MAX_PLAYERS } from "@/types";
import { clampStepIndex, getScoringSteps, SCORING_STEP_COUNT } from "@/lib";
import { useGameSession, usePlayerStandings } from "@/state";
import { Token } from "../Token";
import { Section } from "../ui";
import { usePlayerName } from "../session/player-presentation";
import { usePlayerRename } from "../session/use-player-rename";
import { PlayerStepRow } from "./PlayerStepRow";
import { StepNavigator } from "./StepNavigator";

export function CategoryScoringView() {
  const { t } = useTranslation();
  const { session, dispatch } = useGameSession();
  const standings = usePlayerStandings();
  const resolvePlayerName = usePlayerName();
  const rename = usePlayerRename();

  const steps = getScoringSteps(session.boardSide);
  const activeIndex = clampStepIndex(session.activeStepIndex);
  const step = steps[activeIndex];
  const isLastStep = activeIndex === SCORING_STEP_COUNT - 1;

  const goToStep = (index: number) => dispatch({ type: "SET_ACTIVE_STEP", index });

  return (
    <div className="flex flex-col gap-6">
      <Section title={t(step.labelKey)} description={step.helpKey ? t(step.helpKey) : ""}>
        <StepNavigator steps={steps} activeIndex={activeIndex} onSelect={goToStep} />

        <div className="mt-6 flex justify-center">
          <Token kind={step.token} size={56} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {standings.map(({ player, score }, index) => (
            <PlayerStepRow
              key={player.id}
              player={player}
              name={resolvePlayerName(player, index)}
              total={score.total}
              step={step}
              rename={rename}
            />
          ))}

          {/* Invariante I1: hasta MAX_PLAYERS jugadores. */}
          {session.players.length < MAX_PLAYERS && (
            <button
              type="button"
              onClick={() => dispatch({ type: "ADD_PLAYER" })}
              className="flex min-h-28 items-center justify-center gap-2 rounded-3xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 transition hover:border-slate-500 hover:bg-white hover:text-slate-950"
            >
              <span aria-hidden className="text-lg leading-none">
                +
              </span>
              {t("players.add")}
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToStep(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-950 disabled:border-slate-200 disabled:text-slate-300 disabled:hover:border-slate-200"
          >
            {t("steps.previous")}
          </button>
          <button
            type="button"
            onClick={() =>
              isLastStep
                ? dispatch({ type: "SET_STATUS", status: "finished" })
                : goToStep(activeIndex + 1)
            }
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isLastStep ? t("results.viewResults") : t("steps.next")}
          </button>
        </div>
      </Section>
    </div>
  );
}
