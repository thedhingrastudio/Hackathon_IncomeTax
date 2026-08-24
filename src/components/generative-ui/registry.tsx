import type { ComponentType } from "react";
import type { GenerativeUIBlock, GenerativeUIBlockType } from "../../types/generative-ui";
import {
  ActionPlanBlock,
  AmountComparisonBlock,
  DiagnosisBlock,
  EvidenceBlock,
  NoticeBlock,
  ReviewBlock,
  SourceCheckBlock,
  TimelineBlock,
} from "./blocks";

export interface RegistryBlockProps {
  block: GenerativeUIBlock;
}

export const trustedBlockRegistry: Record<GenerativeUIBlockType, ComponentType<RegistryBlockProps>> = {
  notice: ({ block }) => block.type === "notice" ? <NoticeBlock block={block} /> : null,
  source_check: ({ block }) => block.type === "source_check" ? <SourceCheckBlock block={block} /> : null,
  amount_comparison: ({ block }) => block.type === "amount_comparison" ? <AmountComparisonBlock block={block} /> : null,
  diagnosis: ({ block }) => block.type === "diagnosis" ? <DiagnosisBlock block={block} /> : null,
  evidence: ({ block }) => block.type === "evidence" ? <EvidenceBlock block={block} /> : null,
  action_plan: ({ block }) => block.type === "action_plan" ? <ActionPlanBlock block={block} /> : null,
  review: ({ block }) => block.type === "review" ? <ReviewBlock block={block} /> : null,
  timeline: ({ block }) => block.type === "timeline" ? <TimelineBlock block={block} /> : null,
};
