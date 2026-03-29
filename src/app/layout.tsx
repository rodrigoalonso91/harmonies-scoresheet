import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harmonies Score Sheet",
  description: "Manual scoring app for Harmonies landscapes, animal cards, and Nature's Spirit cards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
