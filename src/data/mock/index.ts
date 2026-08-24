import demandRecord from "./demand.json";
import form26asRecord from "./form26as.json";
import paymentRecord from "./payment.json";
import processingResultRecord from "./processing-result.json";
import returnRecord from "./return.json";
import taxpayerRecord from "./taxpayer.json";
import type { Form26ASRecord, OutstandingDemand, ProcessingResult, TaxPayment, TaxReturn, Taxpayer } from "../../types/tax";

const records = {
  taxpayer: taxpayerRecord as Taxpayer,
  taxReturn: returnRecord as TaxReturn,
  payment: paymentRecord as TaxPayment,
  form26as: form26asRecord as Form26ASRecord,
  processingResult: processingResultRecord as ProcessingResult,
  outstandingDemand: demandRecord as OutstandingDemand,
} as const;

export function getTaxpayer() { return records.taxpayer; }
export function getTaxReturn() { return records.taxReturn; }
export function getTaxPayment() { return records.payment; }
export function getForm26AS() { return records.form26as; }
export function getProcessingResult() { return records.processingResult; }
export function getOutstandingDemand() { return records.outstandingDemand; }
