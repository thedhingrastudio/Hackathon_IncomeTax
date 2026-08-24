import { z } from "zod";
import {
  APPROVED_ACTIONS,
  APPROVED_WORKFLOW_ACTIONS,
  ASSISTANCE_INTENTS,
  GENERATIVE_UI_BLOCK_TYPES,
  GOVERNMENT_RECORD_SOURCES,
  SUPPORTED_DIAGNOSES,
} from "../types/generative-ui.ts";

const identifier = z.string().trim().min(1).max(100);
const displayText = z.string().trim().min(1).max(500);
const amount = z.number().int().nonnegative().finite();
const currency = z.literal("INR");
const source = z.enum(GOVERNMENT_RECORD_SOURCES);
const diagnosis = z.enum(SUPPORTED_DIAGNOSES);
const workflowAction = z.enum(APPROVED_WORKFLOW_ACTIONS);

export const noticeBlockSchema = z.object({
  id: identifier,
  type: z.literal(GENERATIVE_UI_BLOCK_TYPES[0]),
  tone: z.enum(["info", "warning", "success", "neutral"]),
  title: displayText,
  body: displayText,
}).strict();

export const sourceCheckBlockSchema = z.object({
  id: identifier,
  type: z.literal(GENERATIVE_UI_BLOCK_TYPES[1]),
  title: displayText,
  sources: z.array(z.object({
    source,
    label: displayText,
    status: z.enum(["pending", "checking", "complete", "unavailable"]),
  }).strict()).min(1),
}).strict();

const comparisonSideSchema = z.object({
  label: displayText,
  amount,
  currency,
  status: displayText.optional(),
}).strict();

export const amountComparisonBlockSchema = z.object({
  id: identifier,
  type: z.literal(GENERATIVE_UI_BLOCK_TYPES[2]),
  title: displayText,
  left: comparisonSideSchema,
  right: comparisonSideSchema,
  difference: z.object({ label: displayText, amount, currency }).strict().optional(),
}).strict();

export const diagnosisBlockSchema = z.object({
  id: identifier,
  type: z.literal(GENERATIVE_UI_BLOCK_TYPES[3]),
  title: displayText,
  diagnosis,
  summary: displayText.optional(),
}).strict();

export const evidenceBlockSchema = z.object({
  id: identifier,
  type: z.literal(GENERATIVE_UI_BLOCK_TYPES[4]),
  title: displayText,
  items: z.array(z.object({
    source,
    label: displayText,
    value: z.union([displayText, z.number().finite()]),
    status: z.enum(["confirmed", "reflected", "processed", "action_required", "unavailable"]).optional(),
    reference: identifier.optional(),
  }).strict()).min(1),
}).strict();

export const actionPlanBlockSchema = z.object({
  id: identifier,
  type: z.literal(GENERATIVE_UI_BLOCK_TYPES[5]),
  title: displayText,
  summary: displayText.optional(),
  steps: z.array(z.object({
    action: workflowAction,
    title: displayText,
    description: displayText,
    status: z.enum(["ready", "blocked", "pending", "complete"]),
  }).strict()).min(1),
}).strict();

export const reviewBlockSchema = z.object({
  id: identifier,
  type: z.literal(GENERATIVE_UI_BLOCK_TYPES[6]),
  title: displayText,
  action: workflowAction,
  fields: z.array(z.object({
    label: displayText,
    value: z.union([displayText, z.number().finite()]),
  }).strict()).min(1),
  confirmationMessage: displayText,
}).strict();

export const timelineBlockSchema = z.object({
  id: identifier,
  type: z.literal(GENERATIVE_UI_BLOCK_TYPES[7]),
  title: displayText,
  items: z.array(z.object({
    id: identifier,
    title: displayText,
    description: displayText.optional(),
    status: z.enum(["complete", "current", "pending"]),
  }).strict()).min(1),
}).strict();

export const generativeUIBlockSchema = z.discriminatedUnion("type", [
  noticeBlockSchema,
  sourceCheckBlockSchema,
  amountComparisonBlockSchema,
  diagnosisBlockSchema,
  evidenceBlockSchema,
  actionPlanBlockSchema,
  reviewBlockSchema,
  timelineBlockSchema,
]);

export const assistanceResponseSchema = z.object({
  caseId: identifier,
  intent: z.enum(ASSISTANCE_INTENTS),
  diagnosis: diagnosis.optional(),
  summary: displayText.optional(),
  blocks: z.array(generativeUIBlockSchema),
  actions: z.array(z.object({
    id: identifier,
    action: z.enum(APPROVED_ACTIONS),
    label: displayText,
  }).strict()),
}).strict();

export function parseAssistanceResponse(input: unknown) {
  return assistanceResponseSchema.parse(input);
}

export function safeParseAssistanceResponse(input: unknown) {
  return assistanceResponseSchema.safeParse(input);
}
