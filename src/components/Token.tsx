import Image from "next/image";
import mountainToken from "@/assets/mountain-token.png";
import grassToken from "@/assets/grass-token.png";
import fieldToken from "@/assets/field-token.png";
import buildingToken from "@/assets/building-token.png";
import waterToken from "@/assets/water-token.png";
import animalToken from "@/assets/animal-token.png";
import spiritToken from "@/assets/spirit-token.png";
import { TokenKind } from "@/types";

interface Props {
  kind: TokenKind;
}

export function Token({ kind }: Props) {
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
  animal: animalToken,
  spirit: spiritToken,
};
