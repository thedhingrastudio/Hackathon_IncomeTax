export const GENERATIVE_UI_BLOCK_TYPES = [
  "notice",
  "source_check",
  "amount_comparison",
  "diagnosis",
  "evidence",
  "action_plan",
  "review",
  "timeline",
] as const;

export const ASSISTANCE_INTENTS = [
  "understand_outstanding_demand",
  "resolve_outstanding_demand",
] as const;

export const SUPPORTED_DIAGNOSES = ["payment_missing_from_processed_return"] as const;

export const APPROVED_ACTIONS = [
  "view_demand",
  "request_assistance",
  "view_evidence",
  "tax_credit_rectification",
  "respond_to_demand",
  "review_rectification",
  "submit_rectification",
  "review_demand_response",
  "submit_demand_response",
  "view_case",
] as const;

export const APPROVED_WORKFLOW_ACTIONS = [
  "tax_credit_rectification",
  "respond_to_demand",
] as const;

export const GOVERNMENT_RECORD_SOURCES = [
  "outstanding_demand",
  "filed_return",
  "processed_return",
  "tax_payment",
  "form_26as",
] as const;

export type GenerativeUIBlockType = (typeof GENERATIVE_UI_BLOCK_TYPES)[number];
export type AssistanceIntent = (typeof ASSISTANCE_INTENTS)[number];
export type SupportedDiagnosis = (typeof SUPPORTED_DIAGNOSES)[number];
export type ApprovedAction = (typeof APPROVED_ACTIONS)[number];
export type ApprovedWorkflowAction = (typeof APPROVED_WORKFLOW_ACTIONS)[number];
export type GovernmentRecordSource = (typeof GOVERNMENT_RECORD_SOURCES)[number];
export type Currency = "INR";

interface BaseBlock {
  id: string;
  title: string;
}

export interface NoticeBlock extends BaseBlock {
  type: "notice";
  tone: "info" | "warning" | "success" | "neutral";
  body: string;
}

export interface SourceCheckBlock extends BaseBlock {
  type: "source_check";
  sources: Array<{
    source: GovernmentRecordSource;
    label: string;
    status: "pending" | "checking" | "complete" | "unavailable";
  }>;
}

export interface AmountComparisonBlock extends BaseBlock {
  type: "amount_comparison";
  left: { label: string; amount: number; currency: Currency; status?: string };
  right: { label: string; amount: number; currency: Currency; status?: string };
  difference?: { label: string; amount: number; currency: Currency };
}

export interface DiagnosisBlock extends BaseBlock {
  type: "diagnosis";
  diagnosis: SupportedDiagnosis;
  summary?: string;
}

export interface EvidenceBlock extends BaseBlock {
  type: "evidence";
  items: Array<{
    source: GovernmentRecordSource;
    label: string;
    value: string | number;
    status?: "confirmed" | "reflected" | "processed" | "action_required" | "unavailable";
    reference?: string;
  }>;
}

export interface ActionPlanBlock extends BaseBlock {
  type: "action_plan";
  summary?: string;
  steps: Array<{
    action: ApprovedWorkflowAction;
    title: string;
    description: string;
    status: "ready" | "blocked" | "pending" | "complete";
  }>;
}

export interface ReviewBlock extends BaseBlock {
  type: "review";
  action: ApprovedWorkflowAction;
  fields: Array<{ label: string; value: string | number }>;
  confirmationMessage: string;
}

export interface TimelineBlock extends BaseBlock {
  type: "timeline";
  items: Array<{
    id: string;
    title: string;
    description?: string;
    status: "complete" | "current" | "pending";
  }>;
}

export type GenerativeUIBlock =
  | NoticeBlock
  | SourceCheckBlock
  | AmountComparisonBlock
  | DiagnosisBlock
  | EvidenceBlock
  | ActionPlanBlock
  | ReviewBlock
  | TimelineBlock;

export interface AssistanceResponseAction {
  id: string;
  action: ApprovedAction;
  label: string;
}

export interface AssistanceResponse {
  caseId: string;
  intent: AssistanceIntent;
  diagnosis?: SupportedDiagnosis;
  summary?: string;
  blocks: GenerativeUIBlock[];
  actions: AssistanceResponseAction[];
}
