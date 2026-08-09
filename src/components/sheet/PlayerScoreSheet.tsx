import { AnimalsSection } from "./AnimalsSection";
import { LandscapesSection } from "./LandscapesSection";
import { NatureSpiritSection } from "./NatureSpiritSection";
import { TotalsPanel } from "./TotalsPanel";

/** Formulario y totales del jugador activo. */
export function PlayerScoreSheet() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
      <div className="flex flex-col gap-6">
        <LandscapesSection />
        <AnimalsSection />
        <NatureSpiritSection />
      </div>

      <aside className="flex flex-col gap-6 xl:sticky xl:top-8 xl:self-start">
        <TotalsPanel />
      </aside>
    </div>
  );
}
