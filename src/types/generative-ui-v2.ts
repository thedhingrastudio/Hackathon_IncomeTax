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
