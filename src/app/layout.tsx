import type { Metadata } from "next";
import type { ReactNode } from "react";
import UX4GRuntime from "../components/ux4g/UX4GRuntime";
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
    <html lang="en">
      <body>
        <UX4GRuntime />
        {children}
      </body>
    </html>
  );
}