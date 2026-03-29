"use client";
import { PropsWithChildren, useState } from "react";
import type { BoardSide } from "@/types";
import { calculateScore, INITIAL_INPUT } from "@/lib";
import { NumberField } from "./NumberField";
import { Token } from "./Token";

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#f8fafc_48%,_#dbeafe)] px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-amber-200/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Harmonies</h2>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl leading-tight text-slate-950">Score Sheet</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Manual scoring for landscapes, animal cards, and Nature&apos;s Spirit cards.
                Use Side A for rivers and Side B for islands.
              </p>
            </div>
            <BoardSideToggle side={input.boardSide} onChange={updateBoardSide} />
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleResetScores}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              Reset scores
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <Section
              title="Landscapes"
              description="Enter only scoring groups or valid structures. The app calculates subtotals from the official rules."
            >
              <div id="grass" className="grid gap-4 md:grid-cols-2 mb-4">
                <div className="mx-auto"><Token kind="grass" size={50} /></div>
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
              </div>

              <div id="mountains" className="grid gap-4 md:grid-cols-2 mb-4">
                <div className="mx-auto"><Token kind="mountain" size={50} /></div>
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
              </div>


              <div id="fields" className="grid gap-4 md:grid-cols-2 mb-4">
                <div className="mx-auto"><Token kind="field" size={50} /></div>
                <NumberField
                  label="Field groups"
                  help="Count each yellow group of size 2 or more once."
                  value={input.fieldGroups}
                  onChange={(value) => setInput((current) => ({ ...current, fieldGroups: value }))}
                />
              </div>

              <div id="buildings" className="grid gap-4 md:grid-cols-2 mb-4">
                <div className="mx-auto"><Token kind="building" size={50} /></div>
                <NumberField
                  label="Valid buildings"
                  help="Each must be surrounded by at least 3 different colors."
                  value={input.validBuildings}
                  onChange={(value) => setInput((current) => ({ ...current, validBuildings: value }))}
                />
              </div>

              <div id="water" className="grid gap-4 md:grid-cols-2 mb-4">
                <div className="mx-auto"><Token kind="water" size={50} /></div>
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
              </div>
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
    <section className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.06)] backdrop-blur">
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
    <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
      {(["A", "B"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${side === option
            ? "bg-slate-950 text-white"
            : "text-slate-600 hover:text-slate-950"
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
