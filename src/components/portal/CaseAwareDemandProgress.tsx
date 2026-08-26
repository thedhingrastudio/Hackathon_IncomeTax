"use client";
import Link from "next/link";
import { useTaxDemandCase } from "../../lib/storage/case-storage";
export default function CaseAwareDemandProgress({fallbackHref,fallbackLabel}:{fallbackHref:string;fallbackLabel:string}){const item=useTaxDemandCase();return <><p>{item?.state==="WAITING_FOR_REVIEW"?"Case status: Waiting for Income Tax review":"Review this demand and choose how you want to respond."}</p><Link className="app-action app-action-primary" href={item?`/case/${item.caseId}`:fallbackHref}>{item?"View case":fallbackLabel}</Link></>}
