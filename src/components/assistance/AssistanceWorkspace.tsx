import { X } from "lucide-react";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { OutstandingDemand } from "@/types/tax";
import AssistanceComposer from "./AssistanceComposer";
import AssistanceHome from "./AssistanceHome";

export default function AssistanceWorkspace({
  closeButtonRef,
  demand,
  id,
  onClose,
  taxpayerName,
}: {
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  demand: OutstandingDemand;
  id: string;
  onClose: () => void;
  taxpayerName: string;
}) {
  return (
    <aside aria-label="Assistance Workspace" className="assistance-workspace" id={id}>
      <div className="assistance-workspace-bar">
        <div><span aria-hidden="true" className="assistance-mark">A</span><strong>Assistance</strong></div>
        <Button aria-label="Close assistance" onClick={onClose} ref={closeButtonRef} size="icon-lg" type="button" variant="ghost">
          <X aria-hidden="true" />
        </Button>
      </div>
      <Separator />
      <div className="assistance-workspace-scroll"><AssistanceHome demand={demand} taxpayerName={taxpayerName} /></div>
      <AssistanceComposer />
    </aside>
  );
}
