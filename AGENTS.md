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

The citizen should understand their problem and desired outcome.

They should not have to understand the internal machinery of the government portal in order to resolve it.

The core interaction philosophy is:

Intent → Context → Diagnosis → Generated Interface → Citizen Decision → Government Workflow → Status

Use:

**Conversational intelligence, graphical interaction.**

Do not create a chatbot-first product.

Natural language is an input mechanism.

The primary output should be clear graphical user interface components such as:

- comparisons
- evidence
- summaries
- action plans
- forms
- progress states
- confirmations
- timelines

---

## Two Supported Experiences

The same underlying Income Tax service must support two paths.

### Standard Experience

A citizen may browse and use the portal without AI assistance.

They should be able to navigate:

Dashboard → Pending Actions → Outstanding Demand → Submit Response

This path should remain understandable and functional without AI.

### AI-Assisted Experience

When AI assistance is enabled, the citizen may:

- ask for help from the dashboard;
- use natural language;
- request contextual help from an Outstanding Demand page;
- allow the system to compare relevant synthetic records;
- receive a plain-language diagnosis;
- receive a generated corrective workflow;
- review all information;
- explicitly confirm final actions.

AI assistance must remain optional.

Turning AI assistance off must not prevent use of the underlying government service.

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
- determine which approved UI blocks should be presented;
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

Do not allow an LLM to generate arbitrary HTML, JavaScript, React, URLs or application code for rendering.

Generative UI must work through a trusted structured schema.

Example flow:

AI / Mock Assistance Engine

→ structured UI blocks

→ schema validation

→ trusted React component mapping

→ rendered interface

Approved initial UI block families include:

- notice
- source_check
- amount_comparison
- diagnosis
- evidence
- action_plan
- review
- timeline

The AI may choose and populate approved components.

It may not invent new executable components at runtime.

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

### `src/components/ux4g`

UX4G integration and reusable wrappers.

---

## Design System

Use UX4G as the government design-system foundation.

Before implementing or materially changing UI, inspect the UX4G design instructions available under:

`.agents/skills/ux4g-design/`

Prefer official UX4G:

- design tokens;
- components;
- accessibility patterns;
- spacing conventions;
- navigation conventions;
- responsive behavior.

Custom components are allowed when UX4G does not provide the interaction required for the AI-native experience.

Custom components should visually belong to the same overall system.

Do not turn the interface into a generic startup dashboard.

Do not use excessive gradients, sparkles, AI imagery, robot avatars or persistent chatbot bubbles.

The intelligence should be visible through adaptation and clarity rather than decorative AI branding.

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
3. Read the UX4G skill when performing UI work.
4. Stay inside the requested increment.
5. Do not begin later increments without being asked.

Before completing an implementation task:

1. Run lint.
2. Run relevant tests when available.
3. Run the production build.
4. Report important files changed.
5. Report any limitations or remaining issues.

Do not automatically commit changes unless explicitly instructed.