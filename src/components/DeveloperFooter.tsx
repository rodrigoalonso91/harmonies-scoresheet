"use client";

import { ChevronUp, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function DeveloperFooter() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center *:pointer-events-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={
          open ? t("developerFooter.hideCredits") : t("developerFooter.showCredits")
        }
        className="flex h-5 w-12 items-center justify-center rounded-t-md border border-b-0 border-neutral-300 bg-neutral-50 text-neutral-600 shadow-sm transition hover:bg-neutral-100 hover:text-neutral-900"
      >
        <ChevronUp
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <footer
        className={`grid w-full overflow-hidden border-t border-neutral-300 bg-neutral-50 text-sm text-neutral-800 transition-all duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-transparent"
        }`}
      >
        <div className="min-h-0">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-3">
            <span className="inline-flex items-center gap-1">
              {t("developerFooter.createdBy")}
              <a
                href="https://wa.me/5491171349980"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-neutral-900 underline-offset-2 hover:text-green-700 hover:underline"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Rodrigo Alonso
              </a>
            </span>
            <span className="hidden sm:inline">·</span>
            <a
              href="mailto:rodrigoalonso.dev@gmail.com"
              className="inline-flex items-center gap-1 font-medium text-neutral-900 underline-offset-2 hover:text-blue-700 hover:underline"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              rodrigoalonso.dev@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
