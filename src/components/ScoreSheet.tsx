"use client";
import { PropsWithChildren, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { BoardSide } from "@/types";
import { calculateScore, INITIAL_INPUT } from "@/lib";
import harmoniesLogo from "@/assets/harmonies-logo.png";
import { NumberField } from "./NumberField";
import { TokenGroup } from "./TokenGroup";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function ScoreSheet() {
  const { t } = useTranslation();
  const [input, setInput] = useState(INITIAL_INPUT);
  const score = calculateScore(input);

  const updateBoardSide = (side: BoardSide) => {
    setInput((current) => ({
      ...current,
      boardSide: side,
      water:
        side === "A"
          ? { ...current.water, islandCount: 0 }
          : {
              ...current.water,
              islandCount: Math.max(1, current.water.islandCount),
              longestRiver: 0,
            },
    }));
  };

  const handleResetScores = () => {
    setInput((current) => ({
      ...INITIAL_INPUT,
      boardSide: current.boardSide,
      water:
        current.boardSide === "A"
          ? { longestRiver: 0, islandCount: 0 }
          : { longestRiver: 0, islandCount: 1 },
    }));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7,#f8fafc_48%,#dbeafe)] px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_15%_-25%,#1f6b82,transparent_55%),radial-gradient(circle_at_115%_5%,#2c4d80,transparent_50%),linear-gradient(155deg,#0a1e31,#102f47_58%,#0b2036)] p-8 text-white shadow-[0_28px_90px_rgba(8,20,35,0.45)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-cyan-400/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="w-56 md:w-72">
                <Image
                  src={harmoniesLogo}
                  alt={t("header.logoAlt")}
                  priority
                  className="h-auto w-full drop-shadow-[0_4px_18px_rgba(4,12,24,0.6)]"
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-200/80">
                {t("header.subtitle")}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {t("header.intro")}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <LanguageSwitcher />
              <BoardSideToggle
                side={input.boardSide}
                onChange={updateBoardSide}
              />
              <button
                type="button"
                onClick={handleResetScores}
                className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white hover:bg-white/10 hover:text-white"
              >
                {t("header.resetScores")}
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <Section
              title={t("landscapes.title")}
              description={t("landscapes.description")}
            >
              <TokenGroup id="grass" kind="grass">
                <NumberField
                  label={t("landscapes.trees.greenOnly.label")}
                  help={t("landscapes.trees.greenOnly.help")}
                  value={input.trees.greenOnly}
                  onChange={(value) =>
                    setInput((current) => ({
                      ...current,
                      trees: { ...current.trees, greenOnly: value },
                    }))
                  }
                />
                <NumberField
                  label={t("landscapes.trees.brownGreen.label")}
                  help={t("landscapes.trees.brownGreen.help")}
                  value={input.trees.brownGreen}
                  onChange={(value) =>
                    setInput((current) => ({
                      ...current,
                      trees: { ...current.trees, brownGreen: value },
                    }))
                  }
                />
                <NumberField
                  label={t("landscapes.trees.doubleBrownGreen.label")}
                  help={t("landscapes.trees.doubleBrownGreen.help")}
                  value={input.trees.doubleBrownGreen}
                  onChange={(value) =>
                    setInput((current) => ({
                      ...current,
                      trees: { ...current.trees, doubleBrownGreen: value },
                    }))
                  }
                />
              </TokenGroup>

              <TokenGroup id="mountains" kind="mountain">
                <NumberField
                  label={t("landscapes.mountains.height1")}
                  value={input.mountains.height1}
                  onChange={(value) =>
                    setInput((current) => ({
                      ...current,
                      mountains: { ...current.mountains, height1: value },
                    }))
                  }
                />
                <NumberField
                  label={t("landscapes.mountains.height2")}
                  value={input.mountains.height2}
                  onChange={(value) =>
                    setInput((current) => ({
                      ...current,
                      mountains: { ...current.mountains, height2: value },
                    }))
                  }
                />
                <NumberField
                  label={t("landscapes.mountains.height3")}
                  value={input.mountains.height3}
                  onChange={(value) =>
                    setInput((current) => ({
                      ...current,
                      mountains: { ...current.mountains, height3: value },
                    }))
                  }
                />
              </TokenGroup>

              <TokenGroup id="fields" kind="field">
                <NumberField
                  label={t("landscapes.fields.groups.label")}
                  help={t("landscapes.fields.groups.help")}
                  value={input.fieldGroups}
                  onChange={(value) =>
                    setInput((current) => ({ ...current, fieldGroups: value }))
                  }
                />
              </TokenGroup>

              <TokenGroup id="buildings" kind="building">
                <NumberField
                  label={t("landscapes.buildings.valid.label")}
                  help={t("landscapes.buildings.valid.help")}
                  value={input.validBuildings}
                  onChange={(value) =>
                    setInput((current) => ({
                      ...current,
                      validBuildings: value,
                    }))
                  }
                />
              </TokenGroup>

              <TokenGroup id="water" kind="water">
                <NumberField
                  label={t("landscapes.water.longestRiver.label")}
                  help={t("landscapes.water.longestRiver.help")}
                  value={input.water.longestRiver}
                  disabled={input.boardSide === "B"}
                  onChange={(value) =>
                    setInput((current) => ({
                      ...current,
                      water: { ...current.water, longestRiver: value },
                    }))
                  }
                />
                <NumberField
                  label={t("landscapes.water.islandCount.label")}
                  help={t("landscapes.water.islandCount.help")}
                  value={input.water.islandCount}
                  disabled={input.boardSide === "A"}
                  min={input.boardSide === "B" ? 1 : 0}
                  onChange={(value) =>
                    setInput((current) => ({
                      ...current,
                      water: {
                        ...current.water,
                        islandCount:
                          input.boardSide === "B" ? Math.max(1, value) : value,
                      },
                    }))
                  }
                />
              </TokenGroup>
            </Section>

            <Section
              title={t("animals.title")}
              description={t("animals.description")}
            >
              <NumberField
                label={t("animals.totalPoints")}
                value={input.animalPoints}
                onChange={(value) =>
                  setInput((current) => ({ ...current, animalPoints: value }))
                }
              />
            </Section>

            <Section
              title={t("natureSpirit.title")}
              description={t("natureSpirit.description")}
            >
              <NumberField
                label={t("natureSpirit.totalPoints")}
                value={input.natureSpiritPoints}
                onChange={(value) =>
                  setInput((current) => ({
                    ...current,
                    natureSpiritPoints: value,
                  }))
                }
              />
            </Section>
          </div>

          <aside className="flex flex-col gap-6 xl:sticky xl:top-8 xl:self-start">
            <Section
              tone="dark"
              title={t("totals.title")}
              description={t("totals.description")}
            >
              <dl className="grid gap-2.5">
                <ScoreRow
                  label={t("totals.trees")}
                  value={score.landscapes.trees}
                />
                <ScoreRow
                  label={t("totals.mountains")}
                  value={score.landscapes.mountains}
                />
                <ScoreRow
                  label={t("totals.fields")}
                  value={score.landscapes.fields}
                />
                <ScoreRow
                  label={t("totals.water")}
                  value={score.landscapes.water}
                />
                <ScoreRow
                  label={t("totals.buildings")}
                  value={score.landscapes.buildings}
                />
                <ScoreRow
                  label={t("totals.landscapes")}
                  value={score.landscapes.total}
                  emphasized
                />
                <div aria-hidden className="my-1 h-px bg-white/10" />
                <ScoreRow
                  label={t("totals.animalCards")}
                  value={score.animals}
                />
                <ScoreRow
                  label={t("totals.natureSpirit")}
                  value={score.natureSpirits}
                />
                <div aria-hidden className="my-1 h-px bg-white/10" />
                <ScoreRow
                  label={t("totals.grandTotal")}
                  value={score.total}
                  grand
                />
              </dl>
            </Section>
          </aside>
        </div>
      </div>
    </main>
  );
}

interface SectionProps {
  title: string;
  description: string;
  tone?: "light" | "dark";
}

function Section({
  title,
  description,
  tone = "light",
  children,
}: PropsWithChildren<SectionProps>) {
  const dark = tone === "dark";

  return (
    <section
      className={
        dark
          ? "relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_10%_-25%,#5f2740,transparent_40%),radial-gradient(circle_at_115%_-5%,#623a33,transparent_35%),linear-gradient(155deg,#220e26,#33142a_56%,#220d1a)] p-6 text-white shadow-[0_28px_90px_rgba(35,10,30,0.45)]"
          : "rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur"
      }
    >
      {dark && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-rose-400/15 blur-3xl"
        />
      )}
      <div className="relative mb-6">
        <h2
          className={`text-xl font-semibold tracking-tight ${dark ? "text-white" : "text-slate-950"}`}
        >
          {title}
        </h2>
        <p
          className={`mt-1 text-sm leading-6 ${dark ? "text-slate-300" : "text-slate-500"}`}
        >
          {description}
        </p>
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}

interface BoardSideToggleProps {
  side: BoardSide;
  onChange: (side: BoardSide) => void;
}

function BoardSideToggle({ side, onChange }: BoardSideToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur">
      {(["A", "B"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            side === option
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-200 hover:text-white"
          }`}
        >
          {t("header.boardSide", { side: option })}
        </button>
      ))}
    </div>
  );
}

interface ScoreRowProps {
  label: string;
  value: number;
  emphasized?: boolean;
  grand?: boolean;
}

function ScoreRow({
  label,
  value,
  emphasized = false,
  grand = false,
}: ScoreRowProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
        grand
          ? "bg-linear-to-r from-amber-300 via-orange-400 to-rose-500 text-slate-950 shadow-[0_10px_30px_rgba(244,114,102,0.3)]"
          : emphasized
            ? "bg-white/10 text-white ring-1 ring-inset ring-white/15"
            : "bg-white/5 text-slate-200"
      }`}
    >
      <dt
        className={`text-sm ${grand ? "font-semibold" : emphasized ? "font-semibold text-white" : "text-slate-300"}`}
      >
        {label}
      </dt>
      <dd
        className={`tabular-nums ${grand ? "text-xl font-bold" : "text-lg font-semibold"}`}
      >
        {value}
      </dd>
    </div>
  );
}
