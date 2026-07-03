"use client";
import { PropsWithChildren, useState } from "react";
import Image from "next/image";
import type { BoardSide } from "@/types";
import { calculateScore, INITIAL_INPUT } from "@/lib";
import harmoniesLogo from "@/assets/harmonies-logo.png";
import { NumberField } from "./NumberField";
import { TokenGroup } from "./TokenGroup";

export function ScoreSheet() {
  const [input, setInput] = useState(INITIAL_INPUT);
  const score = calculateScore(input);

  const updateBoardSide = (side: BoardSide) => {
    setInput((current) => ({
      ...current,
      boardSide: side,
      water: side === "A"
        ? { ...current.water, islandCount: 0 }
        : { ...current.water, islandCount: Math.max(1, current.water.islandCount), longestRiver: 0 },
    }));
  };

  const handleResetScores = () => {
    setInput((current) => ({
      ...INITIAL_INPUT,
      boardSide: current.boardSide,
      water: current.boardSide === "A"
        ? { longestRiver: 0, islandCount: 0 }
        : { longestRiver: 0, islandCount: 1 },
    }));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7,#f8fafc_48%,#dbeafe)] px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_15%_-25%,#1f6b82,transparent_55%),radial-gradient(circle_at_115%_5%,#2c4d80,transparent_50%),linear-gradient(155deg,#0a1e31,#102f47_58%,#0b2036)] p-8 text-white shadow-[0_28px_90px_rgba(8,20,35,0.45)]">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="w-56 md:w-72">
                <Image src={harmoniesLogo} alt="Harmonies" priority className="h-auto w-full drop-shadow-[0_4px_18px_rgba(4,12,24,0.6)]" />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-200/80">Score Sheet</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Manual scoring for landscapes, animal cards, and Nature&apos;s Spirit cards.
                Use Side A for rivers and Side B for islands.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <BoardSideToggle side={input.boardSide} onChange={updateBoardSide} />
              <button
                type="button"
                onClick={handleResetScores}
                className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white hover:bg-white/10 hover:text-white"
              >
                Reset scores
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <Section
              title="Landscapes"
              description="Enter only scoring groups or valid structures. The app calculates subtotals from the official rules."
            >
              <TokenGroup id="grass" kind="grass">
                <NumberField
                  label="Green-only trees"
                  help="Single green token trees score 1 point each."
                  value={input.trees.greenOnly}
                  onChange={(value) => setInput((current) => ({
                    ...current,
                    trees: { ...current.trees, greenOnly: value },
                  }))}
                />
                <NumberField
                  label="Brown + green trees"
                  help="Trees with 1 brown under 1 green score 3 points."
                  value={input.trees.brownGreen}
                  onChange={(value) => setInput((current) => ({
                    ...current,
                    trees: { ...current.trees, brownGreen: value },
                  }))}
                />
                <NumberField
                  label="2 brown + green trees"
                  help="Trees with 2 brown under 1 green score 5 points."
                  value={input.trees.doubleBrownGreen}
                  onChange={(value) => setInput((current) => ({
                    ...current,
                    trees: { ...current.trees, doubleBrownGreen: value },
                  }))}
                />
              </TokenGroup>

              <TokenGroup id="mountains" kind="mountain">
                <NumberField
                  label="Height 1 mountains"
                  value={input.mountains.height1}
                  onChange={(value) => setInput((current) => ({
                    ...current,
                    mountains: { ...current.mountains, height1: value },
                  }))}
                />
                <NumberField
                  label="Height 2 mountains"
                  value={input.mountains.height2}
                  onChange={(value) => setInput((current) => ({
                    ...current,
                    mountains: { ...current.mountains, height2: value },
                  }))}
                />
                <NumberField
                  label="Height 3 mountains"
                  value={input.mountains.height3}
                  onChange={(value) => setInput((current) => ({
                    ...current,
                    mountains: { ...current.mountains, height3: value },
                  }))}
                />
              </TokenGroup>

              <TokenGroup id="fields" kind="field">
                <NumberField
                  label="Field groups"
                  help="Count each yellow group of size 2 or more once."
                  value={input.fieldGroups}
                  onChange={(value) => setInput((current) => ({ ...current, fieldGroups: value }))}
                />
              </TokenGroup>

              <TokenGroup id="buildings" kind="building">
                <NumberField
                  label="Valid buildings"
                  help="Each must be surrounded by at least 3 different colors."
                  value={input.validBuildings}
                  onChange={(value) => setInput((current) => ({ ...current, validBuildings: value }))}
                />
              </TokenGroup>

              <TokenGroup id="water" kind="water">
                <NumberField
                  label="Longest river"
                  help="Side A only. Score 0, 2, 5, 8, 11, 15, then +4 per token above 6."
                  value={input.water.longestRiver}
                  disabled={input.boardSide === "B"}
                  onChange={(value) => setInput((current) => ({
                    ...current,
                    water: { ...current.water, longestRiver: value },
                  }))}
                />
                <NumberField
                  label="Island count"
                  help="Side B only. There is always at least 1 island."
                  value={input.water.islandCount}
                  disabled={input.boardSide === "A"}
                  min={input.boardSide === "B" ? 1 : 0}
                  onChange={(value) => setInput((current) => ({
                    ...current,
                    water: { ...current.water, islandCount: input.boardSide === "B" ? Math.max(1, value) : value },
                  }))}
                />
              </TokenGroup>
            </Section>

            <Section
              title="Animal Cards"
              description="Enter the total points from all animal cards combined. Example: if all animals sum to 27 points, enter 27."
            >
              <NumberField
                label="Total animal points"
                value={input.animalPoints}
                onChange={(value) => setInput((current) => ({ ...current, animalPoints: value }))}
              />
            </Section>

            <Section
              title="Nature's Spirit"
              description="Enter the total points granted by your spirit card. Example: if the spirit gives 20 points, enter 20."
            >
              <NumberField
                label="Total spirit points"
                value={input.natureSpiritPoints}
                onChange={(value) => setInput((current) => ({ ...current, natureSpiritPoints: value }))}
              />
            </Section>
          </div>

          <aside className="flex flex-col gap-6">
            <Section
              title="Totals"
              description="Landscape and card scores are tracked separately to match the printed score pad."
            >
              <dl className="grid gap-3">
                <ScoreRow label="Trees" value={score.landscapes.trees} />
                <ScoreRow label="Mountains" value={score.landscapes.mountains} />
                <ScoreRow label="Fields" value={score.landscapes.fields} />
                <ScoreRow label="Water" value={score.landscapes.water} />
                <ScoreRow label="Buildings" value={score.landscapes.buildings} />
                <ScoreRow label="Landscapes" value={score.landscapes.total} emphasized />
                <ScoreRow label="Animal cards" value={score.animals} />
                <ScoreRow label="Nature's Spirit" value={score.natureSpirits} />
                <ScoreRow label="Grand total" value={score.total} grand />
              </dl>
            </Section>
          </aside>
        </div>
      </div>
    </main >
  );
}

interface SectionProps {
  title: string;
  description: string;
}

function Section({ title, description, children }: PropsWithChildren<SectionProps>) {
  return (
    <section className="rounded-4xl border border-white/80 bg-white/80 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

interface BoardSideToggleProps {
  side: BoardSide;
  onChange: (side: BoardSide) => void;
}

function BoardSideToggle({ side, onChange }: BoardSideToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur">
      {(["A", "B"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${side === option
            ? "bg-white text-slate-950 shadow-sm"
            : "text-slate-200 hover:text-white"
            }`}
        >
          Side {option}
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

function ScoreRow({ label, value, emphasized = false, grand = false }: ScoreRowProps) {
  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-3 ${grand
      ? "bg-slate-950 text-white"
      : emphasized
        ? "bg-amber-100 text-slate-950"
        : "bg-slate-100 text-slate-800"
      }`}>
      <dt className={`text-sm ${grand || emphasized ? "font-semibold" : ""}`}>{label}</dt>
      <dd className={`text-lg ${grand ? "font-bold" : "font-semibold"}`}>{value}</dd>
    </div>
  );
}
