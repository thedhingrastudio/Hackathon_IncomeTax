# Income Tax Assistance Prototype — Architecture

## Purpose

This document defines the technical architecture for the hackathon prototype.

The architecture must support:

* normal government portal browsing;
* optional AI assistance;
* deterministic financial reconciliation;
* trusted Generative UI;
* explicit citizen confirmation;
* simulated government workflows;
* persistent case status;
* a future OpenAI integration without restructuring the application.

The initial implementation uses synthetic records and a mock assistance engine.

---

# Technology Stack

## Application

Next.js using the App Router.

## UI

React.

## Language

TypeScript.

## Target presentation foundation

- React and Next.js;
- shadcn/ui for structural primitives;
- Magic UI selectively for meaningful motion and visual relationships;
- project-owned design tokens and styling.

**Migration status:** this target has not been implemented. The repository currently still contains UX4G code and dependencies. This documentation change does not install, remove or migrate presentation packages.

## Validation

Zod.

## Prototype Data

Static synthetic JSON.

## Prototype Persistence

Browser localStorage where persistent client state is required.

## Backend Boundary

Next.js Route Handlers when server-side functionality is introduced.

## Initial Assistance Provider

Mock assistance engine.

## Future Assistance Provider

OpenAI API behind a server-side adapter.

---

# High-Level Architecture

```text
                    TAXPAYER
                        │
          ┌─────────────┴─────────────┐
          │                           │
   STANDARD PORTAL              AI ASSISTANCE
          │                           │
          │                   contextual help
          │                   or natural language
          │                           │
          │                           ▼
          │                    INTENT / CASE LAYER
          │                           │
          └─────────────┬─────────────┘
                        │
                        ▼
                  CASE CONTEXT
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
      RETURN          PAYMENT         FORM 26AS
        │               │                │
        └───────────────┼────────────────┘
                        │
                        ▼
                RECONCILIATION ENGINE
                   deterministic
                        │
                        ▼
                   EVIDENCE PACK
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
        RULE ENGINE           ASSISTANCE ENGINE
            │                 mock now / AI later
            │                       │
            └───────────┬───────────┘
                        │
                        ▼
              SURFACE SPECIFICATION
                        │
                        ▼
                  ZOD VALIDATION
                        │
                        ▼
               TRUSTED UI RENDERER
                        │
                        ▼
                  CITIZEN REVIEW
                        │
                 CONSEQUENCE GATE
                        │
                        ▼
                  WORKFLOW ENGINE
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        RECTIFICATION       DEMAND RESPONSE
              │                   │
              └─────────┬─────────┘
                        │
                        ▼
                 MOCK SUBMISSION
                        │
                        ▼
                    CASE STATE
```

---

# Architectural Principle

AI is not the source of truth.

The architecture separates:

**records**

from:

**calculations**

from:

**AI interpretation**

from:

**citizen decisions**

from:

**government actions**.

This separation must remain visible in the codebase.

---

# Layer 1 — Presentation Layer

Location:

`src/app`

and:

`src/components`

Responsibilities:

* page routing;
* page layout;
* portal navigation;
* rendering government information;
* displaying assistance surfaces;
* collecting citizen confirmations;
* responsive behaviour;
* accessibility.

The presentation layer must not independently calculate authoritative financial results.

---

# Application Routes

Initial routes should eventually include:

```text
/
```

Dashboard.

```text
/returns
```

Synthetic Return overview.

```text
/payments
```

Synthetic Tax Payments overview.

```text
/pending-actions
```

Pending Actions overview.

```text
/pending-actions/demand
```

Outstanding Demand detail.

```text
/services
```

Services overview.

```text
/services/rectification
```

Relevant Tax Credit Rectification flow.

```text
/services/demand-response
```

Relevant Demand Response flow.

```text
/case/tax-demand-001
```

Combined assisted-case tracker.

Do not create unrelated deep routes unless the product scope changes explicitly.

---

# Layer 2 — Target Presentation Architecture

The target presentation layer contains these responsibilities:

* **Base UI primitives** — accessible structural controls built from shadcn/ui and project-owned tokens;
* **WorkspaceShell** — preserves the portal on the left and manages the desktop Assistance Workspace on the right;
* **AssistanceDrawerHandle** — the quiet, closed-by-default entry point;
* **Generative Surface Renderer** — renders validated surface specifications;
* **Trusted Representation Registry** — maps approved representation types to application-owned React components;
* **Data Binding Resolver** — resolves validated `dataRef` paths against deterministic context;
* **Approved Action Registry** — maps approved `actionId` values to application-owned behaviour.

The interaction model comes before the component library. Magic UI must be used only where motion communicates a meaningful relationship or state change, not as decorative AI branding.

Current implementation note: `src/components/ux4g` and `UX4GRuntime.tsx` still exist during migration. They are not the future target architecture and must not be removed until an implementation task explicitly authorises it.

---

# Layer 3 — Portal Components

Location:

`src/components/portal`

Examples:

`PortalHeader`

`PrimaryNavigation`

`AccountSummary`

`PendingActionCard`

`DemandSummary`

`PaymentRecord`

`ReturnSummary`

`ServiceCard`

`AssistanceDrawerHandle` (target)

`WorkspaceShell` (target)

These are normal reusable portal components.

They should work independently of the AI assistance system.

---

# Layer 4 — Generative UI Components

Location:

`src/components/generative-ui`

Target trusted representations:

`Attention`

`DeadlineCalendar`

`Comparison`

`Explanation`

`SourceTrace`

`Checklist`

`Decision`

`ActionPlan`

`Timeline`

The application owns these components.

The AI or Mock Assistance Engine is only allowed to select from approved component types and provide validated content.

---

# Generative UI Architecture

Do not implement:

```text
LLM
  ↓
arbitrary HTML / React
  ↓
browser
```

Target flow:

```text
EVIDENCE / CONTEXT
        ↓
ASSISTANCE ENGINE
        ↓
SURFACE SPECIFICATION
        ↓
ZOD SCHEMA
        ↓
TRUSTED REPRESENTATION REGISTRY
        ↓
RESOLVE dataRef BINDINGS
        ↓
RENDERED ASSISTANCE WORKSPACE
```

Example conceptual response:

```json
{
  "surface": "understanding",
  "layout": "stack",
  "blocks": [
    {
      "type": "comparison",
      "variant": "financial_mismatch",
      "items": [
        { "label": "You paid", "valueRef": "evidence.payment.amount" },
        { "label": "Processed return", "valueRef": "evidence.processedReturn.recognisedTax" }
      ],
      "differenceRef": "reconciliation.difference"
    },
    {
      "type": "explanation",
      "factSetRef": "diagnosis.primary"
    },
    {
      "type": "source_trace",
      "collapsed": true
    }
  ],
  "primaryAction": { "actionId": "review_rectification", "label": "Fix this" }
}
```

The model selects approved representations and may generate supporting copy. It does not provide authoritative amounts directly when a deterministic binding is available. The exact V2 schema will be defined in a later implementation task; the current code remains unchanged.

---

# Layer 5 — Synthetic Data

Location:

`src/data/mock`

Initial files:

`taxpayer.json`

`return.json`

`payment.json`

`form26as.json`

`processing-result.json`

`demand.json`

All data is fictional.

These files simulate authoritative government records for the prototype.

The application must not derive authoritative amounts from AI text.

---

# Synthetic Data Model

## Taxpayer

Contains:

* synthetic taxpayer ID;
* name;
* masked synthetic PAN;
* contact information if required.

## Return

Contains:

* Assessment Year;
* tax liability;
* Self-Assessment Tax claimed;
* filing status;
* synthetic return reference.

## Payment

Contains:

* amount;
* payment type;
* payment date;
* Assessment Year;
* synthetic challan;
* status.

## Form 26AS

Contains:

* Assessment Year;
* payment amount;
* payment type;
* reflected status.

## Processing Result

Contains:

* Assessment Year;
* recognised Self-Assessment Tax;
* processing status;
* synthetic processing reference.

## Demand

Contains:

* Assessment Year;
* amount;
* status;
* synthetic demand reference.

---

# Layer 6 — Domain Types

Location:

`src/types`

Likely files:

`tax.ts`

`case.ts`

`genui.ts`

Responsibilities:

Define shared TypeScript types for:

* taxpayer records;
* return records;
* payment records;
* demand records;
* reconciliation output;
* workflow state;
* Generative UI representations and surface specifications.

Avoid duplicating incompatible types across components.

---

# Layer 7 — Validation Schemas

Location:

`src/schemas`

Likely schemas:

`taxRecords.ts`

`assistance.ts`

`genui.ts`

Responsibilities:

* validate synthetic data where necessary;
* validate assistance-engine output;
* reject unsupported UI block types;
* reject unsupported actions;
* provide safe fallbacks.

Zod should form the trust boundary between model-generated data and application UI.

---

# Layer 8 — Reconciliation Engine

Location:

`src/lib/reconciliation`

Initial responsibilities:

1. Gather the relevant synthetic records.
2. Compare payment and processed-return values.
3. Verify Assessment Year consistency.
4. calculate the discrepancy.
5. produce structured evidence.
6. return a deterministic diagnosis.

The initial diagnosis is:

`payment_missing_from_processed_return`

---

# Initial Reconciliation Rule

Conceptually:

```text
IF

payment.status == confirmed

AND

payment.assessmentYear == demand.assessmentYear

AND

form26as.paymentAmount == payment.amount

AND

processedReturn.selfAssessmentTaxRecognised == 0

AND

demand.amount == payment.amount

THEN

diagnosis =
payment_missing_from_processed_return
```

The actual implementation should avoid fragile assumptions where possible.

The key architectural requirement is:

**the LLM never performs this calculation.**

---

# Reconciliation Output

A structured result should contain information similar to:

```text
diagnosis

difference

payment record

processed amount

26AS status

demand amount

evidence references

confidence based on deterministic rule match
```

This structured result becomes the Evidence Packet.

---

# Layer 9 — Evidence Packet

The Evidence Packet is the bridge between deterministic records and the assistance layer.

Example conceptual structure:

```json
{
  "caseId": "tax-demand-001",
  "diagnosis": "payment_missing_from_processed_return",
  "assessmentYear": "2026-27",
  "payment": {
    "amount": 18420,
    "status": "confirmed",
    "date": "2026-07-15"
  },
  "processedReturn": {
    "selfAssessmentTaxRecognised": 0
  },
  "form26as": {
    "amount": 18420,
    "reflected": true
  },
  "demand": {
    "amount": 18420
  },
  "difference": 18420
}
```

The Evidence Packet contains structured facts.

The assistance engine may explain these facts but may not alter them.

---

# Layer 10 — Rules Engine

Location:

`src/lib/rules`

Responsibilities:

Map deterministic diagnoses to approved workflows.

For the initial scenario:

```text
payment_missing_from_processed_return
```

maps to:

```text
1. tax_credit_rectification

2. respond_to_demand
```

The LLM does not invent government workflow identifiers.

Allowed workflow actions should eventually be represented using explicit enums or schemas.

---

# Layer 11 — Assistance Engine

Location:

`src/lib/ai`

Define an interface conceptually similar to:

```text
AssistanceEngine
```

Possible implementations:

`MockAssistanceEngine`

and later:

`OpenAIAssistanceEngine`

Both return the same validated assistance structure.

The frontend should not care which provider generated the result.

---

# Mock Assistance Mode

Initial environment:

```text
AI_PROVIDER=mock
```

The mock engine receives:

* user intent if relevant;
* case context;
* Evidence Packet;
* approved workflow plan.

It returns deterministic structured assistance content.

Benefits:

* reliable demo;
* no external dependency;
* no API cost;
* no latency risk;
* no hallucination risk.

---

# Future OpenAI Mode

Future environment:

```text
AI_PROVIDER=openai
```

Server-side environment:

```text
OPENAI_API_KEY=
OPENAI_MODEL=
```

The API key must never be exposed to browser code or committed to Git.

Future flow:

```text
Browser
   ↓
POST /api/assist
   ↓
Next.js server
   ↓
case context
   ↓
reconciliation result
   ↓
approved workflows
   ↓
OpenAI
   ↓
structured response
   ↓
Zod validation
   ↓
browser
```

The provider switch should not require restructuring the frontend.

---

# Layer 12 — Workflow Engine

Location:

`src/lib/workflows`

Responsibilities:

* manage case state;
* enforce workflow sequence;
* simulate government actions;
* prevent invalid transitions;
* generate synthetic submission references.

Initial workflows:

`tax_credit_rectification`

`respond_to_demand`

---

# Case State Machine

Initial states:

```text
DEMAND_OPEN
      ↓
ASSISTANCE_REQUESTED
      ↓
CHECKING_RECORDS
      ↓
DIAGNOSIS_READY
      ↓
PLAN_READY
      ↓
RECTIFICATION_REVIEW
      ↓
RECTIFICATION_SUBMITTED
      ↓
DEMAND_RESPONSE_REVIEW
      ↓
DEMAND_RESPONSE_SUBMITTED
      ↓
WAITING_FOR_REVIEW
      ↓
RESOLVED
```

The standard and assisted interfaces may enter this domain workflow differently.

The underlying government-action state should remain consistent.

---

# Invalid Transitions

Examples:

The system must not allow:

`DEMAND_RESPONSE_SUBMITTED`

before:

`RECTIFICATION_SUBMITTED`

for this synthetic scenario.

The system must not mark:

`RECTIFICATION_SUBMITTED`

before explicit user confirmation.

AI must not be able to force a state transition.

---

# Layer 13 — Consequence Gate

This is a product and architectural boundary.

Before any simulated government submission, the user must see:

* action name;
* Assessment Year;
* amount;
* evidence;
* relevant references;
* what will be submitted;
* why it will be submitted.

The system must state:

> Nothing has been submitted yet.

Only a deliberate citizen action may trigger the simulated submission.

---

# Layer 14 — Persistence

Location:

`src/lib/storage`

Initial implementation:

localStorage.

Persist:

* AI assistance preference;
* case state;
* synthetic submission references;
* completed workflow steps.

Do not persist unnecessary synthetic data.

Future production architecture could replace localStorage with authenticated server persistence without requiring major UI changes.

---

# Layer 15 — API Routes

API routes are not required for the earliest hard-coded MVP.

When needed, use:

`src/app/api`

Potential routes:

```text
POST /api/assist
```

Generate structured assistance.

```text
GET /api/case/[caseId]
```

Retrieve current case state.

```text
POST /api/case/[caseId]/rectification
```

Simulate Rectification submission.

```text
POST /api/case/[caseId]/demand-response
```

Simulate Demand Response submission.

For the hackathon, these may remain local simulations if server APIs add unnecessary complexity.

---

# Client vs Server Boundary

## Client Responsibilities

* interactive UI;
* Assistance Workspace open/closed state when implemented;
* navigation;
* user confirmation;
* local case-state presentation;
* localStorage.

## Server Responsibilities When Live AI Is Added

* protect API credentials;
* call external AI providers;
* validate model responses;
* enforce approved tool/workflow access;
* prevent secrets from reaching the browser.

---

# Desktop Workspace State

The target desktop shell preserves one portal route and one contextual Assistance Workspace. Closed, the portal occupies the full workspace. Open, the portal remains visible on the left and assistance occupies the right at an approximate 47/53 split.

Portal navigation state and assistance surface state are coordinated but remain separate. Selecting an attention item may update the portal context and the assistance context together. Closing the workspace must not discard the current portal route, government workflow state or persistent case.

The desktop Assistance Workspace is specified first. Mobile assistance interaction will be designed separately and must not be implemented by merely compressing the desktop split-screen layout.

---

# AI On / Off Architecture

The AI Assistance preference should not modify core government records.

Conceptual state:

```text
aiAssistanceEnabled: boolean
```

When false:

Portal components remain available.

Generative assistance components are not offered.

When true:

Contextual and natural-language assistance may be offered.

The same government workflow engine is used in either case.

---

# Standard and Assisted Path Convergence

```text
                SYNTHETIC TAX RECORDS
                        │
          ┌─────────────┴─────────────┐
          │                           │
    STANDARD PATH              ASSISTED PATH
          │                           │
 user selects procedures       system explains and
 manually                      orchestrates
          │                           │
          └─────────────┬─────────────┘
                        │
                        ▼
                  WORKFLOW ENGINE
                        │
                        ▼
                   VALIDATION
                        │
                        ▼
                  USER CONFIRM
                        │
                        ▼
                 MOCK SUBMISSION
```

There is one government-action architecture.

There are two interaction models.

---

# Accessibility Architecture

Accessibility is not a final polish step.

Reusable components should account for:

* semantic HTML;
* keyboard navigation;
* visible focus;
* meaningful labels;
* sufficient contrast;
* screen-reader status announcements where appropriate;
* non-colour-only status communication;
* mobile touch targets.

Use accessible primitives and application-owned accessibility requirements regardless of presentation library.

---

# Low-Bandwidth Architecture

The prototype should avoid unnecessary client-side complexity.

Prefer:

* system or locally available fonts;
* lightweight assets;
* limited animation;
* no large background video;
* no unnecessary remote libraries;
* text-first loading;
* local state recovery.

The AI-assisted experience should not depend on visually heavy effects to communicate intelligence.

---

# Failure Architecture

The prototype should fail safely.

If assistance output fails validation:

show a normal portal fallback.

If AI is unavailable:

the citizen can continue using the standard service.

If the system cannot determine a diagnosis:

do not invent one.

Show:

> We couldn't safely determine why this demand exists from the records available.

Then allow:

* viewing records;
* normal portal navigation;
* requesting human/professional help where appropriate.

---

# Folder Responsibility Map

```text
src/
│
├── app/
│   └── routes and page composition
│
├── components/
│   ├── portal/
│   │   └── normal Income Tax UI
│   │
│   ├── ux4g/
│   │   └── current presentation implementation during migration
│   │
│   ├── assistance-workspace/  (target)
│   │   └── persistent workspace shell and surfaces
│   │
│   └── generative-ui/
│       └── trusted representations and binding/action registries
│
├── data/
│   └── mock/
│       └── synthetic government records
│
├── lib/
│   ├── ai/
│   │   └── assistance providers
│   │
│   ├── reconciliation/
│   │   └── deterministic comparison
│   │
│   ├── rules/
│   │   └── diagnosis → workflow mapping
│   │
│   ├── workflows/
│   │   └── state machine and mock actions
│   │
│   └── storage/
│       └── persistence
│
├── schemas/
│   └── runtime validation
│
└── types/
    └── shared TypeScript models
```

---

# Initial Implementation Rule

Do not implement every architectural layer immediately.

The architecture exists so new increments have a defined home.

Build only the layer required by the current increment.

Avoid speculative abstractions that do not yet support a real feature.

---

# MVP Architecture Order

Implementation should progress in this order:

Foundation

→ Portal Shell

→ Synthetic Records

→ Standard Demand Flow

→ Deterministic Reconciliation

→ Trusted Generative UI Schema

→ Assisted Journey

→ Rectification Workflow

→ Demand Response Workflow

→ Case Tracker

→ Optional Natural-Language Entry

→ Optional Live AI Adapter

→ Accessibility and Demo Polish

---

# Architecture Success Criteria

The architecture is successful if:

* AI can be removed and the standard portal still works;
* mock AI can later be replaced by a real provider without rebuilding the frontend;
* financial values originate from deterministic records and code;
* AI output cannot directly execute government actions;
* every consequential action requires citizen confirmation;
* the generated experience uses approved UI components;
* the same workflow engine supports standard and assisted paths;
* the prototype remains understandable on mobile;
* the full hackathon scenario can be demonstrated without any live government dependency.
