import { PanelRightOpen } from "lucide-react";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";

export default function AssistanceDrawerHandle({
  controls,
  expanded,
  handleRef,
  onOpen,
}: {
  controls: string;
  expanded: boolean;
  handleRef: RefObject<HTMLButtonElement | null>;
  onOpen: () => void;
}) {
  return (
    <Button
      aria-controls={controls}
      aria-expanded={expanded}
      aria-label="Open assistance"
      className="assistance-handle"
      onClick={onOpen}
      ref={handleRef}
      type="button"
      variant="outline"
    >
      <PanelRightOpen aria-hidden="true" />
      <span>Assist</span>
    </Button>
  );
}
