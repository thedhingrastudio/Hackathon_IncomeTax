import CaseTracker from "../../../components/portal/CaseTracker";
export default async function CasePage({params}:{params:Promise<{caseId:string}>}){const {caseId}=await params;return <CaseTracker caseId={caseId}/>;}
