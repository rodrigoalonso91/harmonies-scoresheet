"use client";
import { useTranslation } from "react-i18next";
import { useActivePlayer } from "@/state";
import { NumberField } from "../NumberField";
import { Section } from "../ui";

export function AnimalsSection() {
  const { t } = useTranslation();
  const { player, updateSheet } = useActivePlayer();

  return (
    <Section title={t("animals.title")} description={t("animals.description")}>
      <NumberField
        label={t("animals.totalPoints")}
        value={player.sheet.animalPoints}
        onChange={(animalPoints) => updateSheet({ animalPoints })}
      />
    </Section>
  );
}
