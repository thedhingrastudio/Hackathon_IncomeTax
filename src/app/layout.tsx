import type { Metadata } from "next";
import type { ReactNode } from "react";
import PortalShell from "../components/portal/PortalShell";
import { getForm26AS, getOutstandingDemand, getProcessingResult, getTaxPayment, getTaxpayer, getTaxReturn } from "../data/mock";
import { createDemandUnderstanding } from "../lib/ai";
import "./globals.css";
import "./mobile-final.css";
import localFont from "next/font/local";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = localFont({
  src: "../../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-sans",
  weight: "100 900",
});

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
  const demand = getOutstandingDemand();
  const understanding = createDemandUnderstanding({
    taxReturn: getTaxReturn(),
    payment: getTaxPayment(),
    form26as: getForm26AS(),
    processingResult: getProcessingResult(),
    outstandingDemand: demand,
  });

  return (
    <html lang="en" data-theme="light" className={`font-sans ${geist.variable}`}>
<body>
  <TooltipProvider>
    <PortalShell demand={demand} taxpayerId={taxpayer.taxpayerId} taxpayerName={taxpayer.name} understanding={understanding}>{children}</PortalShell>
  </TooltipProvider>
</body>
    </html>
  );
}
