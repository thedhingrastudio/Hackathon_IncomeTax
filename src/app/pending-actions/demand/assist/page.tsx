import AssistedDemandExperience from "../../../../components/portal/AssistedDemandExperience";
import PageHeading from "../../../../components/portal/PageHeading";
import { getForm26AS, getOutstandingDemand, getProcessingResult, getTaxPayment, getTaxReturn } from "../../../../data/mock";

export default function AssistedDemandPage() {
  const records = {
    taxReturn: getTaxReturn(),
    payment: getTaxPayment(),
    form26as: getForm26AS(),
    processingResult: getProcessingResult(),
    outstandingDemand: getOutstandingDemand(),
  };
  const provider = process.env.AI_PROVIDER ?? "mock";

  return <>
    <PageHeading eyebrow="Outstanding Demand" title="Understand this demand" description="We’ll compare the Income Tax records already linked to this demand and explain what they show." backHref="/pending-actions/demand" backLabel="Outstanding Demand" />
    <AssistedDemandExperience records={records} provider={provider} />
  </>;
}
