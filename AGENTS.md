# Income Tax Assistance Prototype — Agent Instructions

## Project

This repository contains a hackathon proof of concept exploring an AI-assisted redesign of one specific Income Tax e-Filing journey.

The project is NOT a redesign of the entire Income Tax portal.

The primary problem is:

A taxpayer has already paid ₹18,420 in Self-Assessment Tax, but the processed return recognises ₹0 of that payment and an outstanding demand of ₹18,420 is created.

The taxpayer does not understand why the demand exists or which government processes are required to resolve it.

The prototype demonstrates how an intelligent public-service interface can diagnose the situation, explain it clearly, orchestrate the necessary workflows, and allow the citizen to review and confirm every consequential action.

All taxpayer, financial, government, payment, return and identity information in this repository is synthetic.

---

## Product Principle

The citizen should understand their problem and desired outcome without first understanding the internal machinery of the government portal.

The core interaction philosophy is:

Intent → Context → Diagnosis → Generated Interface → Citizen Decision → Government Workflow → Status

Use **conversational intelligence, graphical interaction**.

**Conversation controls the interface. It does not become the interface.**

AI is neither the website nor the default interface. Natural language is a persistent control for an optional Assistance Workspace, not the start of a permanent transcript. The primary output should be graphical representations such as comparisons, evidence, explanations, action plans, forms, confirmations and timelines.

---

## Two Supported Experiences

The same underlying Income Tax service must support two paths.

### Standard Experience

A citizen may browse and use the portal without AI assistance.

They should be able to navigate:

Dashboard → Pending Actions → Outstanding Demand → Submit Response

This path should remain understandable and functional without AI.

### AI-Assisted Experience

AI is represented by a quiet, persistent drawer handle while the conventional portal occupies the full workspace. When the citizen intentionally invokes assistance, a persistent right-side Assistance Workspace opens while the current government page remains visible and contextual on the left.

Within this workspace, the citizen may:

- see priorities, deadlines and contextual explanations;
- use natural language to control the workspace;
- request help from a supported portal context;
- allow the system to compare relevant synthetic records;
- receive a plain-language diagnosis and graphical representation;
- receive an approved corrective workflow;
- review all information;
- explicitly confirm final actions;
- track the resulting case.

AI assistance must remain optional.

Turning AI assistance off must not prevent use of the underlying government service.

The government side reflects the system's structure. The assistance side reflects the citizen's situation.

---

## Core Synthetic Scenario

Taxpayer:

Rohan Mehta

Assessment Year:

2026–27

Self-Assessment Tax payment:

₹18,420

Payment date:

15 July 2026

Payment status:

Confirmed

Processed return Self-Assessment Tax recognised:

₹0

Form 26AS:

₹18,420 reflected

Outstanding demand:

₹18,420

Primary diagnosis:

`payment_missing_from_processed_return`

Corrective workflow:

1. Tax Credit Rectification
2. Response to Outstanding Demand

---

## AI Responsibilities

AI may:

- interpret natural-language intent;
- explain government terminology;
- summarize structured evidence;
- explain discrepancies;
- recommend a workflow from an approved set;
- generate plain-language explanations;
- determine which approved representation is most useful;
- prepare information for citizen review.

AI must NOT:

- calculate authoritative tax amounts;
- determine tax liability independently;
- invent tax records;
- invent government rules;
- invent government workflow types;
- execute submissions automatically;
- make payments;
- submit legally meaningful declarations;
- override deterministic validation;
- modify authoritative synthetic records.

All financial calculations and record comparisons must come from deterministic code.

---

## Generative UI

Do not allow an LLM to generate arbitrary HTML, JavaScript, React, CSS, URLs or application code for rendering.

Generative UI V2 works through a trusted surface specification:

AI / Mock Assistance Engine

→ validated surface specification

→ trusted representation registry

→ deterministic `dataRef` binding resolution

→ rendered Assistance Workspace

The approved representation grammar is:

- Attention
- DeadlineCalendar
- Comparison
- Explanation
- SourceTrace
- Checklist
- Decision
- ActionPlan
- Timeline

These are representations, not nine generic cards. Surface types are constrained to `home`, `understanding`, `decision`, `action`, `review` and `status`. Layout choices are constrained to approved enums.

The AI may choose approved representations, layouts, progressive disclosure and supporting `copy`. Authoritative values must be supplied through validated `dataRef` bindings. Actions must use application-approved `actionId` values. The AI may not invent executable components, arbitrary layout values or authoritative facts at runtime.

---

## Government Actions

Consequential actions must cross an explicit confirmation boundary.

Before any simulated government submission, the citizen must see:

- what will be submitted;
- why it is being submitted;
- relevant monetary amounts;
- relevant evidence;
- the government process involved.

The interface must clearly state that nothing has been submitted until the user confirms.

---

## Architecture

Keep these responsibilities separate:

### `src/data/mock`

Synthetic government and taxpayer records.

### `src/lib/reconciliation`

Deterministic comparison and reconciliation logic.

### `src/lib/rules`

Deterministic rules and permitted workflow mappings.

### `src/lib/ai`

Assistance-engine interfaces.

Initially use a mock implementation.

A real LLM provider may be added later behind the same interface.

### `src/lib/workflows`

Government workflow state and simulated actions.

### `src/lib/storage`

Local case persistence.

### `src/schemas`

Validation schemas, including Generative UI output validation.

### `src/components/generative-ui`

Trusted UI components used by the adaptive experience.

### `src/components/portal`

Normal government portal interface components.

### Target presentation components

Future presentation responsibilities include base UI primitives, the Assistance Workspace shell, the Generative Surface Renderer, a Trusted Representation Registry, a Data Binding Resolver and an Approved Action Registry.

The repository still contains `src/components/ux4g` during migration. Do not treat that current implementation detail as the target architecture, and do not remove it except in an explicitly authorised implementation increment.

---

## Design System

The target presentation foundation is:

- shadcn/ui for structural UI primitives;
- Magic UI selectively for motion that explains meaningful relationships or state change;
- project-owned visual tokens and product styling.

The interaction model comes before the component library. The application must remain a credible, trustworthy government service rather than a generic startup dashboard.

Current implementation note: UX4G code and dependencies still exist. The presentation migration has not yet happened. Do not install, remove or replace presentation dependencies unless the current task explicitly authorises that migration step.

Do not turn the interface into a generic startup dashboard.

Do not use excessive gradients, sparkles, AI imagery, robot avatars or persistent chatbot bubbles.

The intelligence should be visible through adaptation and clarity rather than decorative AI branding.

The desktop Assistance Workspace is specified first. Do not implement mobile by simply shrinking the desktop split-screen model. Mobile assistance interaction will be specified separately.

---

## Accessibility

The prototype must be:

- keyboard accessible;
- responsive;
- mobile usable;
- understandable without hover;
- compatible with visible focus states;
- designed with sufficient contrast;
- usable with larger text;
- designed around clear plain-language labels.

Avoid exposing government terminology when plain language can communicate the same idea.

Government terminology may be revealed progressively when useful.

---

## Low-Bandwidth Principle

Avoid unnecessary dependencies, animation and heavy media.

Critical content should load before decorative content.

Case progress should eventually be recoverable after reload.

---

## Scope

Do not build unrelated Income Tax functionality unless explicitly requested.

The deep functional scope is limited to:

- Outstanding Demand
- relevant payment record
- relevant processed return
- relevant Form 26AS record
- Tax Credit Rectification
- Response to Outstanding Demand
- associated AI-assisted experience
- case tracking

Other portal sections may exist only to make the prototype browsable.

Do not silently expand project scope.

---

## Development Rules

Before making changes:

1. Read this file.
2. Read the relevant documents in `/docs`.
3. Read the current target design and interaction documents when performing UI work.
4. Distinguish the current UX4G implementation from the target presentation architecture.
5. Stay inside the requested increment.
6. Do not begin later increments without being asked.

Before completing an implementation task:

1. Run lint.
2. Run relevant tests when available.
3. Run the production build.
4. Report important files changed.
5. Report any limitations or remaining issues.

Do not automatically commit changes unless explicitly instructed.
