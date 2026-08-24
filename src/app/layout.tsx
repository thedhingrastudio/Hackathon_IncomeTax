import type { Metadata } from "next";
import type { ReactNode } from "react";
import UX4GRuntime from "../components/ux4g/UX4GRuntime";
import PortalShell from "../components/portal/PortalShell";
import { getTaxpayer } from "../data/mock";
import "./globals.css";

export const metadata: Metadata = {
  title: "Income Tax Assistance Prototype",
  description:
    "Hackathon proof of concept for an AI-assisted Income Tax experience using synthetic data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const taxpayer = getTaxpayer();

  return (
    <html lang="en" data-theme="light">
      <body>
        <UX4GRuntime />
        <PortalShell taxpayerName={taxpayer.name}>{children}</PortalShell>
      </body>
    </html>
  );
}
