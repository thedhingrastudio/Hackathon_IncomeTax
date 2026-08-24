import type { ReactNode } from "react";

export interface RecordDetail {
  label: string;
  value: ReactNode;
}

export default function RecordDetails({ details }: { details: RecordDetail[] }) {
  return <dl className="record-details">{details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>;
}
