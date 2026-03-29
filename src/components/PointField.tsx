"use client";
import type { TokenKind } from "@/types";
import { Token } from "./Token";
import { ChangeEvent } from "react";

interface Props {
  kind: TokenKind;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function PointField({ kind, onChange }: Props) {
  return (
    <div className="flex gap-2 max-w-fit border border-blue-200">
      <Token kind={kind} />
      <input type="number" onChange={onChange} className="w-16 text-black border-amber-900 border rounded-3xl" />
    </div>
  );
} 