"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { Separator } from "@/components/ui/separator";
import type { OutstandingDemand } from "@/types/tax";
import type { DemandUnderstanding } from "@/lib/ai";
import AssistanceComposer from "./AssistanceComposer";
import AssistanceHome from "./AssistanceHome";
import CheckingRecords from "./CheckingRecords";
import UnderstandingSurface from "./UnderstandingSurface";

export type AssistanceSurface = "home" | "checking" | "understanding";

export default function AssistanceWorkspace({
  closeButtonRef,
  demand,
  id,
  onClose,
  onFix,
  onUnderstand,
  surface,
  taxpayerName,
  understanding,
}: {
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  demand: OutstandingDemand;
  id: string;
  onClose: () => void;
  onFix: () => void;
  onUnderstand: () => void;
  surface: AssistanceSurface;
  taxpayerName: string;
  understanding: DemandUnderstanding | null;
}) {
  const surfaceHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (surface !== "home") surfaceHeadingRef.current?.focus();
  }, [surface]);

  const content = surface === "home"
    ? <AssistanceHome demand={demand} onUnderstand={onUnderstand} taxpayerName={taxpayerName} />
    : surface === "checking" && understanding
      ? <CheckingRecords evidence={understanding.evidence} headingRef={surfaceHeadingRef} />
      : understanding
        ? <UnderstandingSurface headingRef={surfaceHeadingRef} onFix={onFix} understanding={understanding} />
        : <section className="assistance-unavailable"><h2 ref={surfaceHeadingRef} tabIndex={-1}>We couldn&apos;t safely explain this demand</h2><p>You can continue using the Outstanding Demand service on the left.</p></section>;

  return (
    <aside aria-label="Assistance Workspace" className="assistance-workspace" id={id}>
      <div className="assistance-workspace-bar">
        <div><span aria-hidden="true" className="assistance-mark">A</span><strong>Assistance</strong></div>
        <Button aria-label="Close assistance" onClick={onClose} ref={closeButtonRef} size="icon-lg" type="button" variant="ghost">
          <X aria-hidden="true" />
        </Button>
      </div>
      <Separator />
      <div className="assistance-workspace-scroll"><BlurFade key={surface} duration={0.28}>{content}</BlurFade></div>
      <AssistanceComposer contextual={surface !== "home"} />
    </aside>
  );
}
