import { formatIndianCurrency } from "../../lib/format-tax";
import type {
  ActionPlanBlock as ActionPlanBlockData,
  AmountComparisonBlock as AmountComparisonBlockData,
  DiagnosisBlock as DiagnosisBlockData,
  EvidenceBlock as EvidenceBlockData,
  NoticeBlock as NoticeBlockData,
  ReviewBlock as ReviewBlockData,
  SourceCheckBlock as SourceCheckBlockData,
  TimelineBlock as TimelineBlockData,
} from "../../types/generative-ui";

const diagnosisLabels = {
  payment_missing_from_processed_return: "Payment missing from processed return",
} as const;

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="ux4g-card ux4g-card-outline ux4g-card-vertical" aria-labelledby={undefined}>
    <div className="ux4g-card-header"><h2>{title}</h2></div>
    <div className="ux4g-card-body">{children}</div>
  </section>;
}

export function NoticeBlock({ block }: { block: NoticeBlockData }) {
  const tone = block.tone === "neutral" ? "info" : block.tone;
  return <section className={`ux4g-alert ux4g-alert-${tone}`} role={block.tone === "warning" ? "alert" : "status"}>
    <div><h2>{block.title}</h2><p>{block.body}</p></div>
  </section>;
}

export function SourceCheckBlock({ block }: { block: SourceCheckBlockData }) {
  return <Card title={block.title}><ul>{block.sources.map((item) => <li key={item.source}><strong>{item.label}</strong> — <span>{item.status}</span></li>)}</ul></Card>;
}

export function AmountComparisonBlock({ block }: { block: AmountComparisonBlockData }) {
  const entries = [block.left, block.right];
  return <Card title={block.title}><dl className="record-details">{entries.map((entry) => <div key={entry.label}><dt>{entry.label}</dt><dd>{formatIndianCurrency(entry.amount, entry.currency)}</dd>{entry.status ? <dd>{entry.status}</dd> : null}</div>)}{block.difference ? <div><dt>{block.difference.label}</dt><dd>{formatIndianCurrency(block.difference.amount, block.difference.currency)}</dd></div> : null}</dl></Card>;
}

export function DiagnosisBlock({ block }: { block: DiagnosisBlockData }) {
  return <Card title={block.title}><p><strong>{diagnosisLabels[block.diagnosis]}</strong></p>{block.summary ? <p>{block.summary}</p> : null}</Card>;
}

export function EvidenceBlock({ block }: { block: EvidenceBlockData }) {
  return <Card title={block.title}><dl className="record-details">{block.items.map((item, index) => <div key={`${item.source}-${item.reference ?? index}`}><dt>{item.label}</dt><dd>{item.value}</dd>{item.status ? <dd>Status: {item.status}</dd> : null}{item.reference ? <dd>Reference: {item.reference}</dd> : null}</div>)}</dl></Card>;
}

export function ActionPlanBlock({ block }: { block: ActionPlanBlockData }) {
  return <Card title={block.title}>{block.summary ? <p>{block.summary}</p> : null}<ol>{block.steps.map((step) => <li key={step.action}><strong>{step.title}</strong><p>{step.description}</p><p>Status: {step.status}</p></li>)}</ol></Card>;
}

export function ReviewBlock({ block }: { block: ReviewBlockData }) {
  return <Card title={block.title}><dl className="review-list">{block.fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl><div className="ux4g-context-alert ux4g-alert-info" role="note"><strong>{block.confirmationMessage}</strong></div></Card>;
}

export function TimelineBlock({ block }: { block: TimelineBlockData }) {
  return <Card title={block.title}><ol>{block.items.map((item) => <li key={item.id}><strong>{item.title}</strong>{item.description ? <p>{item.description}</p> : null}<p>Status: {item.status}</p></li>)}</ol></Card>;
}
