import type { GenerativeUIBlock } from "../../types/generative-ui";
import { trustedBlockRegistry } from "./registry";

export interface GenerativeUIRendererProps {
  blocks: GenerativeUIBlock[];
}

export function GenerativeUIRenderer({ blocks }: GenerativeUIRendererProps) {
  return <>{blocks.map((block) => {
    const Component = trustedBlockRegistry[block.type];
    return Component ? <Component block={block} key={block.id} /> : null;
  })}</>;
}
