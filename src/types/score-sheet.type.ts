export type BoardSide = "A" | "B";

export interface TreeScoreInput {
  greenOnly: number;
  brownGreen: number;
  doubleBrownGreen: number;
}

export interface MountainScoreInput {
  height1: number;
  height2: number;
  height3: number;
  isolatedHeight1: number;
  isolatedHeight2: number;
  isolatedHeight3: number;
}

export interface WaterScoreInput {
  longestRiver: number;
  islandCount: number;
}

export interface AnimalScoreEntry {
  id: string;
  label: string;
  points: number;
}

export interface ScoreSheetInput {
  boardSide: BoardSide;
  trees: TreeScoreInput;
  mountains: MountainScoreInput;
  fieldGroups: number;
  water: WaterScoreInput;
  validBuildings: number;
  animalCards: AnimalScoreEntry[];
  natureSpiritCards: AnimalScoreEntry[];
}

export interface LandscapeBreakdown {
  trees: number;
  mountains: number;
  fields: number;
  water: number;
  buildings: number;
  total: number;
}

export interface ScoreBreakdown {
  landscapes: LandscapeBreakdown;
  animals: number;
  natureSpirits: number;
  total: number;
}

export interface ValidationIssue {
  field: string;
  message: string;
}
