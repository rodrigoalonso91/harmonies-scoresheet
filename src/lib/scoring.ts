import type {
  AnimalScoreEntry,
  BoardSide,
  LandscapeBreakdown,
  ScoreBreakdown,
  ScoreSheetInput,
  ValidationIssue,
} from "@/types";

const RIVER_SCORES: Record<number, number> = {
  0: 0,
  1: 0,
  2: 2,
  3: 5,
  4: 8,
  5: 11,
  6: 15,
};

export function scoreTrees(input: ScoreSheetInput["trees"]): number {
  return (input.greenOnly * 1) + (input.brownGreen * 3) + (input.doubleBrownGreen * 5);
}

export function scoreMountains(input: ScoreSheetInput["mountains"]): number {
  const scoringHeight1 = Math.max(0, input.height1 - input.isolatedHeight1);
  const scoringHeight2 = Math.max(0, input.height2 - input.isolatedHeight2);
  const scoringHeight3 = Math.max(0, input.height3 - input.isolatedHeight3);

  return (scoringHeight1 * 1) + (scoringHeight2 * 3) + (scoringHeight3 * 7);
}

export function scoreFields(fieldGroups: number): number {
  return fieldGroups * 5;
}

export function scoreWater(side: BoardSide, water: ScoreSheetInput["water"]): number {
  if (side === "B") {
    return water.islandCount * 5;
  }

  if (water.longestRiver <= 6) {
    return RIVER_SCORES[water.longestRiver] ?? 0;
  }

  return 15 + ((water.longestRiver - 6) * 4);
}

export function scoreBuildings(validBuildings: number): number {
  return validBuildings * 5;
}

export function scoreEntries(entries: AnimalScoreEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.points, 0);
}

export function calculateLandscapeBreakdown(input: ScoreSheetInput): LandscapeBreakdown {
  const trees = scoreTrees(input.trees);
  const mountains = scoreMountains(input.mountains);
  const fields = scoreFields(input.fieldGroups);
  const water = scoreWater(input.boardSide, input.water);
  const buildings = scoreBuildings(input.validBuildings);

  return {
    trees,
    mountains,
    fields,
    water,
    buildings,
    total: trees + mountains + fields + water + buildings,
  };
}

export function calculateScore(input: ScoreSheetInput): ScoreBreakdown {
  const landscapes = calculateLandscapeBreakdown(input);
  const animals = scoreEntries(input.animalCards);
  const natureSpirits = scoreEntries(input.natureSpiritCards);

  return {
    landscapes,
    animals,
    natureSpirits,
    total: landscapes.total + animals + natureSpirits,
  };
}
