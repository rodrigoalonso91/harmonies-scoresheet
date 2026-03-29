import { ScoreSheetInput } from "@/types";

export const INITIAL_INPUT: ScoreSheetInput = {
  boardSide: "A",
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
