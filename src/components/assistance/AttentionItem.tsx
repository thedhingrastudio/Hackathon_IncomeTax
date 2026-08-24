import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { OutstandingDemand } from "@/types/tax";
import { formatAssessmentYear, formatIndianCurrency, formatRecordLabel } from "@/lib/format-tax";

export default function AttentionItem({ demand, onUnderstand }: { demand: OutstandingDemand; onUnderstand: () => void }) {
  return (
    <Card className="assistance-attention-card">
      <CardContent className="assistance-attention-content">
        <div>
          <p className="assistance-kicker">Outstanding Demand</p>
          <p className="assistance-demand-amount">{formatIndianCurrency(demand.amount, demand.currency)}</p>
          <p className="assistance-demand-context">AY {formatAssessmentYear(demand.assessmentYear)}</p>
        </div>
        <span className="assistance-status"><span aria-hidden="true" />{formatRecordLabel(demand.status)}</span>
        <Button className="assistance-inline-action" onClick={onUnderstand} type="button" variant="link">
          Understand this <ArrowRight aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}
