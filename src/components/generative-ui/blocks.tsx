import { formatIndianCurrency } from "../../lib/format-tax";
import type { ActionPlanBlock as ActionPlanBlockData, AmountComparisonBlock as AmountComparisonBlockData, DiagnosisBlock as DiagnosisBlockData, EvidenceBlock as EvidenceBlockData, NoticeBlock as NoticeBlockData, ReviewBlock as ReviewBlockData, SourceCheckBlock as SourceCheckBlockData, TimelineBlock as TimelineBlockData, ApprovedWorkflowAction } from "../../types/generative-ui";

function Card({ title, headingId, className = "", children }: { title: string; headingId: string; className?: string; children: React.ReactNode }) {
  return <section className={`portal-surface generative-block ${className}`} aria-labelledby={headingId}><div className="portal-surface__header"><h2 id={headingId}>{title}</h2></div><div className="portal-surface__body">{children}</div></section>;
}

export function NoticeBlock({ block }: { block: NoticeBlockData }) {
  const tone = block.tone === "warning" ? "warning" : block.tone === "success" ? "success" : "info";
  return <section className={`portal-alert portal-alert--${tone}`} role={block.tone === "warning" ? "alert" : "status"}><div><h2>{block.title}</h2><p>{block.body}</p></div></section>;
}

export function SourceCheckBlock({ block }: { block: SourceCheckBlockData }) { return <Card title={block.title} headingId={`${block.id}-title`}>{block.summary ? <p className="generative-summary">{block.summary}</p> : null}<ul className="source-check-list">{block.sources.map((item) => <li key={item.source}><strong>{item.label}</strong><span>{item.status === "complete" ? <><span aria-hidden="true">✓ </span>Complete</> : item.status}</span></li>)}</ul></Card>; }

export function AmountComparisonBlock({ block }: { block: AmountComparisonBlockData }) { const entries = [block.left, block.right]; return <Card title={block.title} headingId={`${block.id}-title`} className="amount-comparison-block"><dl className="amount-comparison" aria-label={block.title}>{entries.map((entry) => <div key={entry.label}><dt>{entry.label}</dt><dd className="comparison-amount">{formatIndianCurrency(entry.amount, entry.currency)}</dd>{entry.status ? <dd className="comparison-status">{entry.status}</dd> : null}</div>)}{block.difference ? <div className="comparison-difference"><dt>{block.difference.label}</dt><dd>{formatIndianCurrency(block.difference.amount, block.difference.currency)}</dd></div> : null}</dl></Card>; }

export function DiagnosisBlock({ block }: { block: DiagnosisBlockData }) { return <Card title={block.title} headingId={`${block.id}-title`} className="diagnosis-block">{block.summary ? <p>{block.summary}</p> : null}</Card>; }

export function EvidenceBlock({ block }: { block: EvidenceBlockData }) { const referencedItems = block.items.filter((item) => item.reference); return <Card title={block.title} headingId={`${block.id}-title`}><dl className="evidence-list">{block.items.map((item, index) => <div key={`${item.source}-${item.reference ?? index}`}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>{referencedItems.length ? <details className="evidence-details"><summary>View record details</summary><dl>{referencedItems.map((item) => <div key={`${item.source}-${item.reference}`}><dt>{item.label}</dt><dd>{item.reference}</dd></div>)}</dl></details> : null}</Card>; }

export function ActionPlanBlock({ block, onAction }: { block: ActionPlanBlockData; onAction?: (action: ApprovedWorkflowAction) => void }) { const statusLabels = { ready: "Ready to review", blocked: "Starts after step 1", pending: "Starts after step 1", complete: "Complete" } as const; return <Card title={block.title} headingId={`${block.id}-title`}>{block.summary ? <p>{block.summary}</p> : null}<ol className="action-plan-list">{block.steps.map((step) => <li key={step.action}><strong>{step.title}</strong><p>{step.description}</p><p className="action-plan-status">{statusLabels[step.status]}</p>{step.status === "ready" && onAction ? <button className="app-action app-action-primary" type="button" onClick={() => onAction(step.action)}>Review correction</button> : null}</li>)}</ol></Card>; }

export function ReviewBlock({ block }: { block: ReviewBlockData }) { return <Card title={block.title} headingId={`${block.id}-title`}><dl className="review-list">{block.fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl><div className="portal-alert portal-alert--info" role="note"><strong>{block.confirmationMessage}</strong></div></Card>; }

export function TimelineBlock({ block }: { block: TimelineBlockData }) { return <Card title={block.title} headingId={`${block.id}-title`} className="timeline-block"><ol>{block.items.map((item) => <li key={item.id} aria-current={item.status === "current" ? "step" : undefined}><strong>{item.title}</strong>{item.description ? <p>{item.description}</p> : null}<p>Status: {item.status === "complete" ? "Complete" : item.status === "current" ? "Current" : "Pending"}</p></li>)}</ol></Card>; }
