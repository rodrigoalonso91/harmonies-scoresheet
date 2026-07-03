import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";
import { DeveloperFooter } from "@/components";

export const metadata: Metadata = {
  title: "Harmonies Score Sheet",
  description: "Manual scoring app for Harmonies landscapes, animal cards, and Nature's Spirit cards.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          {children}
          <DeveloperFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
