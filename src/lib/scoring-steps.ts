import type {
  BoardSide,
  PlayerScoreSheet,
  PlayerScoreSheetPatch,
  TokenKind,
} from "@/types";

/**
 * Un paso del modo por categoría: un campo concreto de la hoja, con los
 * accesores para leerlo y escribirlo. Así las vistas no conocen la forma de
 * `PlayerScoreSheet` y agregar un campo es una entrada más en el array.
 */
export interface ScoringStep {
  id: string;
  token: TokenKind;
  labelKey: string;
  helpKey?: string;
  min: number;
  read: (sheet: PlayerScoreSheet) => number;
  write: (value: number) => PlayerScoreSheetPatch;
}

export const SCORING_STEP_COUNT = 11;

/** El paso de agua depende del lado: río en A, islas en B. Nunca los dos. */
function waterStep(boardSide: BoardSide): ScoringStep {
  if (boardSide === "B") {
    return {
      id: "water-islands",
      token: "water",
      labelKey: "landscapes.water.islandCount.label",
      helpKey: "landscapes.water.islandCount.help",
      min: 1,
      read: (sheet) => sheet.water.islandCount,
      write: (value) => ({ water: { islandCount: Math.max(1, value) } }),
    };
  }

  return {
    id: "water-river",
    token: "water",
    labelKey: "landscapes.water.longestRiver.label",
    helpKey: "landscapes.water.longestRiver.help",
    min: 0,
    read: (sheet) => sheet.water.longestRiver,
    write: (value) => ({ water: { longestRiver: value } }),
  };
}

export function getScoringSteps(boardSide: BoardSide): ScoringStep[] {
  return [
    {
      id: "trees-green-only",
      token: "grass",
      labelKey: "landscapes.trees.greenOnly.label",
      helpKey: "landscapes.trees.greenOnly.help",
      min: 0,
      read: (sheet) => sheet.trees.greenOnly,
      write: (greenOnly) => ({ trees: { greenOnly } }),
    },
    {
      id: "trees-brown-green",
      token: "grass",
      labelKey: "landscapes.trees.brownGreen.label",
      helpKey: "landscapes.trees.brownGreen.help",
      min: 0,
      read: (sheet) => sheet.trees.brownGreen,
      write: (brownGreen) => ({ trees: { brownGreen } }),
    },
    {
      id: "trees-double-brown-green",
      token: "grass",
      labelKey: "landscapes.trees.doubleBrownGreen.label",
      helpKey: "landscapes.trees.doubleBrownGreen.help",
      min: 0,
      read: (sheet) => sheet.trees.doubleBrownGreen,
      write: (doubleBrownGreen) => ({ trees: { doubleBrownGreen } }),
    },
    {
      id: "mountains-height-1",
      token: "mountain",
      labelKey: "landscapes.mountains.height1",
      min: 0,
      read: (sheet) => sheet.mountains.height1,
      write: (height1) => ({ mountains: { height1 } }),
    },
    {
      id: "mountains-height-2",
      token: "mountain",
      labelKey: "landscapes.mountains.height2",
      min: 0,
      read: (sheet) => sheet.mountains.height2,
      write: (height2) => ({ mountains: { height2 } }),
    },
    {
      id: "mountains-height-3",
      token: "mountain",
      labelKey: "landscapes.mountains.height3",
      min: 0,
      read: (sheet) => sheet.mountains.height3,
      write: (height3) => ({ mountains: { height3 } }),
    },
    {
      id: "field-groups",
      token: "field",
      labelKey: "landscapes.fields.groups.label",
      helpKey: "landscapes.fields.groups.help",
      min: 0,
      read: (sheet) => sheet.fieldGroups,
      write: (fieldGroups) => ({ fieldGroups }),
    },
    {
      id: "valid-buildings",
      token: "building",
      labelKey: "landscapes.buildings.valid.label",
      helpKey: "landscapes.buildings.valid.help",
      min: 0,
      read: (sheet) => sheet.validBuildings,
      write: (validBuildings) => ({ validBuildings }),
    },
    waterStep(boardSide),
    {
      id: "animal-points",
      token: "animal",
      labelKey: "animals.totalPoints",
      helpKey: "animals.description",
      min: 0,
      read: (sheet) => sheet.animalPoints,
      write: (animalPoints) => ({ animalPoints }),
    },
    {
      id: "nature-spirit-points",
      token: "spirit",
      labelKey: "natureSpirit.totalPoints",
      helpKey: "natureSpirit.description",
      min: 0,
      read: (sheet) => sheet.natureSpiritPoints,
      write: (natureSpiritPoints) => ({ natureSpiritPoints }),
    },
  ];
}

export function clampStepIndex(index: number): number {
  if (!Number.isInteger(index)) return 0;
  return Math.min(SCORING_STEP_COUNT - 1, Math.max(0, index));
}
