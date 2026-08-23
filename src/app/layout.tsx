import type { Metadata } from "next";
import type { ReactNode } from "react";
import UX4GRuntime from "../components/ux4g/UX4GRuntime";
import PortalShell from "../components/portal/PortalShell";
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
  return (
    <html lang="en" data-theme="light">
      <body>
        <UX4GRuntime />
        <PortalShell>{children}</PortalShell>
      </body>
    </html>
  );
}
