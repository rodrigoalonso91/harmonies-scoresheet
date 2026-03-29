import Image from "next/image";
import mountainToken from "@/assets/mountain-token.png";
import grassToken from "@/assets/grass-token.png";
import fieldToken from "@/assets/field-token.png";
import buildingToken from "@/assets/building-token.png";
import waterToken from "@/assets/water-token.png";
import { TerrainType } from "@/types";

interface Props {
  kind: TerrainType;
}

export function NatureToken({ kind }: Props) {
  return (
    <div className="size-20">
      <Image
        src={tokens[kind]}
        alt={kind}
      />
    </div>
  );
}

const tokens = {
  building: buildingToken,
  water: waterToken,
  field: fieldToken,
  grass: grassToken,
  mountain: mountainToken,
};
