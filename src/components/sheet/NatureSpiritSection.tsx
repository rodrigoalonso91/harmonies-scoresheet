"use client";
import { useTranslation } from "react-i18next";
import { useActivePlayer } from "@/state";
import { NumberField } from "../NumberField";
import { Section } from "../ui";

export function NatureSpiritSection() {
  const { t } = useTranslation();
  const { player, updateSheet } = useActivePlayer();

  return (
    <Section title={t("natureSpirit.title")} description={t("natureSpirit.description")}>
      <NumberField
        label={t("natureSpirit.totalPoints")}
        value={player.sheet.natureSpiritPoints}
        onChange={(natureSpiritPoints) => updateSheet({ natureSpiritPoints })}
      />
    </Section>
  );
}
