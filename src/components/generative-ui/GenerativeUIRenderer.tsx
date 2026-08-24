import type { ApprovedWorkflowAction, GenerativeUIBlock } from "../../types/generative-ui";
import { trustedBlockRegistry } from "./registry";
import { ActionPlanBlock } from "./blocks";

export interface GenerativeUIRendererProps {
  blocks: GenerativeUIBlock[];
  onWorkflowAction?: (action: ApprovedWorkflowAction) => void;
}

export function GenerativeUIRenderer({ blocks, onWorkflowAction }: GenerativeUIRendererProps) {
  return <>{blocks.map((block) => {
    if (block.type === "action_plan") return <ActionPlanBlock block={block} key={block.id} onAction={onWorkflowAction} />;
    const Component = trustedBlockRegistry[block.type];
    return Component ? <Component block={block} key={block.id} /> : null;
  })}</>;
}
