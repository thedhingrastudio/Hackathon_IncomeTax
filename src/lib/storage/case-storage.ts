"use client";
import { useSyncExternalStore } from "react";
import { z } from "zod";
import type { TaxDemandCase } from "../../types/case";
export const CASE_STORAGE_KEY = "income-tax-demo-case:v1";
const schema = z.object({ version:z.literal(1), caseId:z.literal("CASE-DEMO-18420"), taxpayerId:z.string().min(1), assessmentYear:z.string().regex(/^\d{4}-\d{2}$/), demandReference:z.string().min(1), demandAmount:z.number().positive(), currency:z.literal("INR"), diagnosis:z.literal("payment_missing_from_processed_return"), state:z.enum(["PLAN_READY","RECTIFICATION_REVIEW","RECTIFICATION_SUBMITTED","DEMAND_RESPONSE_REVIEW","DEMAND_RESPONSE_SUBMITTED","WAITING_FOR_REVIEW","RESOLVED"]), rectificationReference:z.literal("RECT-DEMO-01842").optional(), demandResponseReference:z.literal("DEMAND-RESP-DEMO-18420").optional(), createdAt:z.string(), updatedAt:z.string() }).strict().superRefine((c,ctx)=>{if(["RECTIFICATION_SUBMITTED","DEMAND_RESPONSE_REVIEW","DEMAND_RESPONSE_SUBMITTED","WAITING_FOR_REVIEW","RESOLVED"].includes(c.state)&&!c.rectificationReference)ctx.addIssue({code:"custom",message:"Missing rectification"});if(["DEMAND_RESPONSE_SUBMITTED","WAITING_FOR_REVIEW","RESOLVED"].includes(c.state)&&!c.demandResponseReference)ctx.addIssue({code:"custom",message:"Missing response"});});
export function parseStoredCase(raw:string|null):TaxDemandCase|null { if(!raw)return null; try { const result=schema.safeParse(JSON.parse(raw)); return result.success ? result.data as TaxDemandCase : null; } catch{return null;} }
let value:TaxDemandCase|null=null; let scheduled=false; const listeners=new Set<()=>void>();
function emit(next:TaxDemandCase|null){value=next;listeners.forEach(l=>l());}
export function saveCase(next:TaxDemandCase){localStorage.setItem(CASE_STORAGE_KEY,JSON.stringify(next));emit(next);}
export function getStoredCase(){return parseStoredCase(localStorage.getItem(CASE_STORAGE_KEY));}
export function clearCase(){localStorage.removeItem(CASE_STORAGE_KEY);emit(null);}
export function useTaxDemandCase(){return useSyncExternalStore((listener)=>{listeners.add(listener);if(!scheduled){scheduled=true;setTimeout(()=>{const next=parseStoredCase(localStorage.getItem(CASE_STORAGE_KEY));if(!next)localStorage.removeItem(CASE_STORAGE_KEY);emit(next);},0);}return()=>listeners.delete(listener);},()=>value,()=>null);}
