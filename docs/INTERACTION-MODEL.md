# Assistance Workspace Interaction Model

## Status and scope

This document is the source of truth for the target desktop interaction model. It changes presentation and assistance interaction only. The implemented synthetic records, deterministic reconciliation, Evidence Packet, rules, workflows, consequence gates, persistence, provider abstraction, validation and conventional portal journey remain authoritative.

The current frontend still uses UX4G and separate routes in places. The target described here has not yet been implemented.

## Product principles

> The government side reflects the system's structure. The assistance side reflects the citizen's situation.

> Conversation controls the interface. It does not become the interface.

AI is not the website, the default interface or a mandatory intermediary. The conventional Income Tax portal remains fully usable without it.

## Desktop portal-only state

With assistance closed, the portal occupies the full workspace. It exposes normal navigation and services, Quick Links or Tools, items needing taxpayer attention, and government advisories or updates.

AI is represented only by a quiet persistent drawer handle on the right edge. There is no dominant AI card, large toggle, floating chatbot or transcript.

## Assistance drawer and split

The citizen deliberately invokes assistance. The current portal page remains mounted and visible while the Assistance Workspace opens on the right.

The target desktop relationship is approximately:

- 47% government portal;
- 53% Assistance Workspace.

This ratio is directional rather than an arbitrary model-controlled width. At the narrower portal width, dense portal navigation may collapse behind a semantic Tools or Menu control.

Closing the workspace restores the full portal without losing the current route, workflow state or persistent case.

## What belongs on each side

### Left — government structure

- services and forms;
- official records and notices;
- returns and payments;
- government advisories;
- conventional workflows;
- authoritative review and submission controls.

### Right — citizen context

- priorities and deadlines;
- plain-language explanations;
- relationships between verified records;
- recommended approved actions;
- generated graphical representations;
- the persistent natural-language composer;
- citizen-facing case status.

The workspace may explain or orchestrate the left-side structure, but it does not become the source of government facts or workflow validity.

### No echo between sides

The Assistance Workspace must not mirror information merely because it appears on the conventional portal. Assistance may surface a verified value only when it is required to interpret or compare records, prioritize attention, explain a condition, establish evidence or provenance, or recommend or enable an approved action. This includes necessary repetition inside Comparison, SourceTrace, explanation and consequential-review representations.

> The portal presents the government record.
> Assistance interprets relationships across records.

For the supported demand scenario, the portal owns the official Outstanding Demand record, demand reference, processing details and direct actions. Assistance earns its space by showing the relationship between ₹18,420 paid, ₹0 recognised and the resulting ₹18,420 discrepancy.

### Conventional professional utility

The portal must remain a capable hands-on tax workspace for non-AI users, experienced taxpayers, Chartered Accountants and other professional users. It must not be simplified into a deliberately inferior or beginner-only path.

Clarity must not remove official terminology where professionally useful, direct service access, exact statuses, government references, records, tables, forms, schedules, filters, manual workflows or detailed disclosures. Prefer dual labels where useful, with a human-readable label and its official or professional term.

> Organize the machinery; do not hide it.

> The portal is for doing.
> Assistance is for understanding and orchestrating.

## Seven workspace states

### State 0 — Portal only

The portal fills the workspace and the assistance drawer is closed.

### State 1 — Assistance home

The drawer opens and the portal remains visible. Assistance Home shows welcome/context, genuine attention items, dates to remember and a persistent composer at the bottom. A voice affordance may be present, but voice behaviour is not required by this migration.

### State 2 — Context selected

Selecting the Outstanding Demand attention item updates both sides:

- the portal shows the official Outstanding Demand record;
- the workspace shows `Outstanding demand · ₹18,420 · AY 2026–27`, explains that Income Tax is waiting for a response, and offers **Understand why this is showing**.

### State 3 — Understanding

A question such as **Why is this ₹18,420 showing?** or the **Understand this** action selects the most useful approved representation.

For this scenario, the workspace uses Comparison to show:

- ₹18,420 paid and confirmed;
- ₹0 recognised in the processed return;
- ₹18,420 not counted.

Explanation states that the payment exists in Income Tax records but was not included when the return was processed. **Why we think this** progressively reveals SourceTrace. **Fix this** advances to the approved resolution.

No chat-message stack is accumulated as the primary interface.

### State 4 — Action workspace

The approved resolution is shown outcome-first:

1. **Correct your tax credit** — the existing ₹18,420 payment has been found and the required evidence is ready.
2. **Respond to the demand** — prepared and started only after Step 1 creates a Rectification reference.

Government terminology is secondary, for example `Rectification → Tax Credit Mismatch Correction`.

### State 5 — Review and consequence

The interface deliberately becomes rigid. It shows exactly what will be submitted, why, authoritative values, the government workflow, supporting evidence, the statement **Nothing has been submitted yet**, and an explicit confirmation control.

The model cannot reorder required review information, edit authoritative values, perform declarations, advance state or submit. Deterministic code validates prerequisites; the citizen authorises each action.

### State 6 — Tracking

After both simulated submissions, the same workspace becomes the combined case tracker:

- Outstanding demand · ₹18,420;
- Waiting for Income Tax review;
- Nothing you need to do right now;
- Payment found;
- Problem identified;
- Correction submitted — `RECT-DEMO-01842`;
- Demand response submitted — `DEMAND-RESP-DEMO-18420`;
- Income Tax review — current;
- Resolved — pending.

The case remains `WAITING_FOR_REVIEW`; the prototype never auto-resolves it.

## Persistent composer

The composer is a stable workspace control, normally anchored at the bottom of Assistance Home and supported contextual surfaces. Example inputs include:

- Why do I owe this?
- I already paid this.
- What do I need to do this month?
- Do I need to respond to anything?
- Show me proof.
- What happens next?

The interpreted intent changes the graphical representation above the composer. Conversation history may inform context, but the product must not turn into transcript-first navigation.

## Context synchronization

Portal context and assistance context have separate ownership but can change together. An attention selection may navigate the left side to a record and set the right side to its contextual surface. A conventional navigation action may update or clear assistance context without closing the drawer when doing so is understandable.

Synchronization cannot change authoritative records, skip workflow prerequisites or imply that opening a representation performs a government action.

## Progressive rigidity

The interaction moves through four control levels:

1. **Flexible** — natural-language intent and contextual exploration.
2. **Adaptive** — approved representations, evidence emphasis and progressive disclosure.
3. **Structured** — approved workflows and prerequisite checks.
4. **Rigid** — declarations, review, confirmation and submission.

Generative flexibility decreases as consequences increase.

## Failure and optionality

Invalid assistance output is rejected at validation and falls back to the normal portal. An unsupported diagnosis must be reported as unresolved rather than invented. Closing or disabling assistance must not remove access to the portal, erase a case or modify records.

## Accessibility and performance

The handle, drawer, composer and all actions must be semantic, keyboard operable, visibly focused and understandable without hover. Workspace state changes need appropriate accessible announcements. Critical portal and case content precedes decorative motion. Motion must respect reduced-motion preferences.

## Mobile boundary

The desktop Assistance Workspace is specified first. Mobile assistance interaction will be designed separately and must not be implemented by merely compressing the desktop split-screen layout.

No final mobile drawer, sheet, route or navigation model is established by this document.
