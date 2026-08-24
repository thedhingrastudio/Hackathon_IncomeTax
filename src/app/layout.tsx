import type { Metadata } from "next";
import type { ReactNode } from "react";
import UX4GRuntime from "../components/ux4g/UX4GRuntime";
import PortalShell from "../components/portal/PortalShell";
import { getForm26AS, getOutstandingDemand, getProcessingResult, getTaxPayment, getTaxpayer, getTaxReturn } from "../data/mock";
import { createDemandUnderstanding } from "../lib/ai";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" data-theme="light" className={cn("font-sans", geist.variable)}>
<body>
  <TooltipProvider>
    <UX4GRuntime />
    <PortalShell demand={demand} taxpayerId={taxpayer.taxpayerId} taxpayerName={taxpayer.name} understanding={understanding}>{children}</PortalShell>
  </TooltipProvider>
</body>
    </html>
  );
}
