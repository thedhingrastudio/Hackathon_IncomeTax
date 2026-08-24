import DemandResponseWorkflow from "../../../../components/portal/DemandResponseWorkflow";
import { getOutstandingDemand, getTaxPayment } from "../../../../data/mock";
export default function DemandRespondPage() { return <DemandResponseWorkflow demand={getOutstandingDemand()} payment={getTaxPayment()} />; }
