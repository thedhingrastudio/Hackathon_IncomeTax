import { z } from "zod";
import { UNDERSTANDING_DATA_REFS } from "../types/generative-ui-v2.ts";

const copy = z.string().trim().min(1).max(160);
const dataRef = z.enum(UNDERSTANDING_DATA_REFS);
const boundItem = z.object({ label: copy, valueRef: dataRef, statusRef: dataRef.optional() }).strict();

export const understandingSurfaceSchema = z.object({
  surface: z.literal("understanding"),
  blocks: z.tuple([
    z.object({
      type: z.literal("comparison"),
      variant: z.literal("financial_mismatch"),
      items: z.tuple([boundItem, boundItem]),
      differenceRef: dataRef,
    }).strict(),
    z.object({ type: z.literal("explanation"), factSetRef: z.literal("diagnosis.primary") }).strict(),
    z.object({ type: z.literal("source_trace"), collapsed: z.literal(true), items: z.array(boundItem).min(1).max(6) }).strict(),
  ]),
  primaryAction: z.object({ actionId: z.literal("start_corrective_plan"), label: copy }).strict(),
}).strict();

export function safeParseUnderstandingSurface(input: unknown) {
  return understandingSurfaceSchema.safeParse(input);
}
