import { MockAssistanceEngine } from "./mock-assistance-engine.ts";
import type { AssistanceEngine, AssistanceProvider } from "./types.ts";

export function getAssistanceEngine(provider: string = "mock"): AssistanceEngine {
  if (provider !== "mock") throw new Error(`Unsupported assistance provider: ${provider}`);
  return new MockAssistanceEngine();
}

export function isAssistanceProvider(value: string): value is AssistanceProvider {
  return value === "mock";
}
