"use client";
import type { TerrainType } from "@/types";
import { NatureToken } from "./NatureToken";
import { ChangeEvent } from "react";

interface Props {
  terrain: TerrainType;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function PointField({ terrain, onChange }: Props) {
  return (
    <div className="flex gap-2 max-w-fit border border-blue-200">
      <NatureToken kind={terrain} />
      <input type="number" onChange={onChange} className="w-16 text-black border-amber-900 border rounded-3xl"/>
    </div>
  );
} 