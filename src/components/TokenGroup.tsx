"use client";
import { PropsWithChildren, useState } from "react";
import type { TokenKind } from "@/types";
import { Token } from "./Token";

interface Props {
  kind: TokenKind;
  id?: string;
  defaultOpen?: boolean;
}

export function TokenGroup({ kind, id, defaultOpen = true, children }: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div id={id} className="mb-4">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="mx-auto flex flex-col items-center gap-1 rounded-full p-1 transition hover:opacity-80"
      >
        <Token kind={kind} size={50} />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {children}
        </div>
      )}
    </div>
  );
}
