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

/**
 * Hoja de puntaje de un jugador. No incluye `boardSide`: el lado del tablero es
 * una propiedad de la partida y aplica por igual a todos los jugadores.
 */
export interface PlayerScoreSheet {
  trees: TreeScoreInput;
  mountains: MountainScoreInput;
  fieldGroups: number;
  water: WaterScoreInput;
  validBuildings: number;
  animalPoints: number;
  natureSpiritPoints: number;
}

/** Cambio parcial sobre una hoja. Los grupos anidados se mezclan de forma superficial. */
export interface PlayerScoreSheetPatch {
  trees?: Partial<TreeScoreInput>;
  mountains?: Partial<MountainScoreInput>;
  water?: Partial<WaterScoreInput>;
  fieldGroups?: number;
  validBuildings?: number;
  animalPoints?: number;
  natureSpiritPoints?: number;
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
