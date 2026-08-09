import type { PropsWithChildren } from "react";

interface Props {
  title: string;
  description: string;
  tone?: "light" | "dark";
}

export function Section({ title, description, tone = "light", children }: PropsWithChildren<Props>) {
  const dark = tone === "dark";

  return (
    <section
      className={
        dark
          ? "relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_10%_-25%,#5f2740,transparent_40%),radial-gradient(circle_at_115%_-5%,#623a33,transparent_35%),linear-gradient(155deg,#220e26,#33142a_56%,#220d1a)] p-6 text-white shadow-[0_28px_90px_rgba(35,10,30,0.45)]"
          : "rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur"
      }
    >
      {dark && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-rose-400/15 blur-3xl"
        />
      )}
      <div className="relative mb-6">
        <h2
          className={`text-xl font-semibold tracking-tight ${dark ? "text-white" : "text-slate-950"}`}
        >
          {title}
        </h2>
        <p
          className={`mt-1 text-sm leading-6 ${dark ? "text-slate-300" : "text-slate-500"}`}
        >
          {description}
        </p>
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}
