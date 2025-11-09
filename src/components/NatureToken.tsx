import Image from "next/image";
import mountainToken from "@/assets/mountain-token.png";
import grassToken from "@/assets/grass-token.png";
import fieldToken from "@/assets/field-token.png";
import buildingToken from "@/assets/building-token.png";
// import waterToken from "@/assets/water-token.png";

interface Props {
  kind: 'building' | 'water' | 'field' | 'grass' | 'mountain';
}

export function NatureToken({ kind }: Props) {
  return (
    <div className="size-32">
      <Image
        src={tokens[kind]}
        alt={kind}

      />
    </div>
  );
}

const tokens = {
  building: buildingToken,
  water: '',
  field: fieldToken,
  grass: grassToken,
  mountain: mountainToken,
};
  