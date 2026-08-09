"use client";
import { useTranslation } from "react-i18next";
import { useActivePlayer } from "@/state";
import { NumberField } from "../NumberField";
import { TokenGroup } from "../TokenGroup";
import { Section } from "../ui";

export function LandscapesSection() {
  const { t } = useTranslation();
  const { player, boardSide, updateSheet } = useActivePlayer();
  const { trees, mountains, fieldGroups, validBuildings, water } = player.sheet;

  return (
    <Section title={t("landscapes.title")} description={t("landscapes.description")}>
      <TokenGroup id="grass" kind="grass">
        <NumberField
          label={t("landscapes.trees.greenOnly.label")}
          help={t("landscapes.trees.greenOnly.help")}
          value={trees.greenOnly}
          onChange={(greenOnly) => updateSheet({ trees: { greenOnly } })}
        />
        <NumberField
          label={t("landscapes.trees.brownGreen.label")}
          help={t("landscapes.trees.brownGreen.help")}
          value={trees.brownGreen}
          onChange={(brownGreen) => updateSheet({ trees: { brownGreen } })}
        />
        <NumberField
          label={t("landscapes.trees.doubleBrownGreen.label")}
          help={t("landscapes.trees.doubleBrownGreen.help")}
          value={trees.doubleBrownGreen}
          onChange={(doubleBrownGreen) => updateSheet({ trees: { doubleBrownGreen } })}
        />
      </TokenGroup>

      <TokenGroup id="mountains" kind="mountain">
        <NumberField
          label={t("landscapes.mountains.height1")}
          value={mountains.height1}
          onChange={(height1) => updateSheet({ mountains: { height1 } })}
        />
        <NumberField
          label={t("landscapes.mountains.height2")}
          value={mountains.height2}
          onChange={(height2) => updateSheet({ mountains: { height2 } })}
        />
        <NumberField
          label={t("landscapes.mountains.height3")}
          value={mountains.height3}
          onChange={(height3) => updateSheet({ mountains: { height3 } })}
        />
      </TokenGroup>

      <TokenGroup id="fields" kind="field">
        <NumberField
          label={t("landscapes.fields.groups.label")}
          help={t("landscapes.fields.groups.help")}
          value={fieldGroups}
          onChange={(value) => updateSheet({ fieldGroups: value })}
        />
      </TokenGroup>

      <TokenGroup id="buildings" kind="building">
        <NumberField
          label={t("landscapes.buildings.valid.label")}
          help={t("landscapes.buildings.valid.help")}
          value={validBuildings}
          onChange={(value) => updateSheet({ validBuildings: value })}
        />
      </TokenGroup>

      <TokenGroup id="water" kind="water">
        <NumberField
          label={t("landscapes.water.longestRiver.label")}
          help={t("landscapes.water.longestRiver.help")}
          value={water.longestRiver}
          disabled={boardSide === "B"}
          onChange={(longestRiver) => updateSheet({ water: { longestRiver } })}
        />
        <NumberField
          label={t("landscapes.water.islandCount.label")}
          help={t("landscapes.water.islandCount.help")}
          value={water.islandCount}
          disabled={boardSide === "A"}
          min={boardSide === "B" ? 1 : 0}
          onChange={(islandCount) =>
            updateSheet({
              water: { islandCount: boardSide === "B" ? Math.max(1, islandCount) : islandCount },
            })
          }
        />
      </TokenGroup>
    </Section>
  );
}
