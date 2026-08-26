export const UNDERSTANDING_DATA_REFS = [
  "evidence.payment.amount",
  "evidence.payment.status",
  "evidence.form26as.amount",
  "evidence.form26as.status",
  "evidence.processedReturn.recognisedTax",
  "evidence.demand.amount",
  "evidence.demand.status",
  "reconciliation.difference",
] as const;

export type UnderstandingDataRef = (typeof UNDERSTANDING_DATA_REFS)[number];
export type UnderstandingActionId = "start_corrective_plan";

export const ACTION_DATA_REFS = ["evidence.payment.amount", "evidence.payment.date", "evidence.payment.type", "workflow.tax_credit_rectification.ready", "workflow.respond_to_demand.dependency"] as const;
export type ActionDataRef = (typeof ACTION_DATA_REFS)[number];
export type ActionSurfaceSpecification = {
  surface: "action";
  blocks: [
    { type: "checklist"; variant: "readiness"; items: [{ label: string; amountRef: ActionDataRef; dateRef: ActionDataRef; typeRef: ActionDataRef; readinessRef: ActionDataRef }] },
    { type: "action_plan"; steps: [{ workflow: "tax_credit_rectification"; label: string }, { workflow: "respond_to_demand"; label: string; dependencyRef: ActionDataRef }] },
  ];
  primaryAction: { actionId: "review_rectification"; label: string };
};

export type UnderstandingSurfaceSpecification = {
  surface: "understanding";
  blocks: [
    {
      type: "comparison";
      variant: "financial_mismatch";
      items: [
        { label: string; valueRef: UnderstandingDataRef; statusRef?: UnderstandingDataRef },
        { label: string; valueRef: UnderstandingDataRef; statusRef?: UnderstandingDataRef },
      ];
      differenceRef: UnderstandingDataRef;
    },
    {
      type: "explanation";
      factSetRef: "diagnosis.primary";
    },
    {
      type: "source_trace";
      collapsed: true;
      items: Array<{ label: string; valueRef: UnderstandingDataRef; statusRef?: UnderstandingDataRef }>;
    },
  ];
  primaryAction: { actionId: UnderstandingActionId; label: string };
};
