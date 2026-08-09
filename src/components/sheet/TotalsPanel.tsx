"use client";
import { useTranslation } from "react-i18next";
import { useActivePlayer } from "@/state";
import { ScoreRow, Section } from "../ui";

export function TotalsPanel() {
  const { t } = useTranslation();
  const { score } = useActivePlayer();

  return (
    <Section tone="dark" title={t("totals.title")} description={t("totals.description")}>
      <dl className="grid gap-2.5">
        <ScoreRow label={t("totals.trees")} value={score.landscapes.trees} />
        <ScoreRow label={t("totals.mountains")} value={score.landscapes.mountains} />
        <ScoreRow label={t("totals.fields")} value={score.landscapes.fields} />
        <ScoreRow label={t("totals.water")} value={score.landscapes.water} />
        <ScoreRow label={t("totals.buildings")} value={score.landscapes.buildings} />
        <ScoreRow label={t("totals.landscapes")} value={score.landscapes.total} emphasized />
        <div aria-hidden className="my-1 h-px bg-white/10" />
        <ScoreRow label={t("totals.animalCards")} value={score.animals} />
        <ScoreRow label={t("totals.natureSpirit")} value={score.natureSpirits} />
        <div aria-hidden className="my-1 h-px bg-white/10" />
        <ScoreRow label={t("totals.grandTotal")} value={score.total} grand />
      </dl>
    </Section>
  );
}
