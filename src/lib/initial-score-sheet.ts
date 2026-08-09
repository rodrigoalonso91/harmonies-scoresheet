import type { BoardSide, PlayerScoreSheet } from "@/types";

export const INITIAL_SHEET: PlayerScoreSheet = {
  trees: {
    greenOnly: 0,
    brownGreen: 0,
    doubleBrownGreen: 0,
  },
  mountains: {
    height1: 0,
    height2: 0,
    height3: 0,
    isolatedHeight1: 0,
    isolatedHeight2: 0,
    isolatedHeight3: 0,
  },
  fieldGroups: 0,
  water: {
    longestRiver: 0,
    islandCount: 0,
  },
  validBuildings: 0,
  animalPoints: 0,
  natureSpiritPoints: 0,
};

/**
 * Invariante I5: el lado A puntúa el río más largo y no tiene islas; el lado B
 * puntúa islas (mínimo 1) y no tiene río.
 */
export function normalizeWaterForSide(
  water: PlayerScoreSheet["water"],
  boardSide: BoardSide,
): PlayerScoreSheet["water"] {
  if (boardSide === "A") {
    return { longestRiver: water.longestRiver, islandCount: 0 };
  }

  return { longestRiver: 0, islandCount: Math.max(1, water.islandCount) };
}

export function createInitialSheet(boardSide: BoardSide): PlayerScoreSheet {
  return {
    ...INITIAL_SHEET,
    trees: { ...INITIAL_SHEET.trees },
    mountains: { ...INITIAL_SHEET.mountains },
    water: normalizeWaterForSide(INITIAL_SHEET.water, boardSide),
  };
}
