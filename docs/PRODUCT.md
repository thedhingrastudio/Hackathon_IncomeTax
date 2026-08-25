# Income Tax Assistance Prototype

## Overview

This project is a hackathon proof of concept exploring what an AI-native Indian public service could look like.

The prototype focuses on one specific Income Tax e-Filing problem rather than redesigning the entire Income Tax portal.

The central product principle is:

> Citizens should be able to describe or understand their real problem without first understanding the internal machinery of a government website.

The prototype combines:

- normal portal browsing;
- optional AI assistance;
- deterministic financial reconciliation;
- contextual explanations;
- adaptive graphical interfaces;
- citizen-controlled government actions;
- persistent case tracking.

AI is an optional assistance layer, not a mandatory intermediary.

---

# Problem

A taxpayer has already paid Self-Assessment Tax.

However, the payment is not correctly represented in the processed return.

The Income Tax system therefore shows an outstanding demand.

The taxpayer's real question is:

> "I already paid this. Why am I being asked to pay again?"

The current experience can require the taxpayer to understand concepts and services such as:

- Outstanding Demand;
- Self-Assessment Tax;
- challans;
- Form 26AS;
- processed returns;
- Tax Credit Mismatch;
- Rectification;
- Response to Outstanding Demand;
- CPC.

The citizen may need to determine which government process fixes the problem before they fully understand what caused it.

---

# Core Synthetic Scenario

The prototype uses one fictional taxpayer and synthetic government records.

## Taxpayer

Rohan Mehta

## Assessment Year

2026–27

## Self-Assessment Tax payment

₹18,420

Payment date:

15 July 2026

Status:

Confirmed

## Filed / processed return

Self-Assessment Tax recognised:

₹0

## Form 26AS

Self-Assessment Tax:

₹18,420

Status:

Reflected

## Outstanding Demand

₹18,420

Status:

Action required

---

# Root Cause

The prototype's deterministic reconciliation system identifies that:

- the ₹18,420 payment exists;
- it belongs to the correct Assessment Year;
- Form 26AS reflects the payment;
- the processed return recognises ₹0;
- the resulting outstanding demand is ₹18,420.

The prototype classifies the case as:

`payment_missing_from_processed_return`

---

# Proposed Resolution

The service identifies that the citizen needs two government actions:

1. Tax Credit Rectification
2. Response to Outstanding Demand

The citizen should not have to discover these procedures independently.

The system should explain the problem and orchestrate the required workflows.

---

# Product Philosophy

The normal Income Tax portal is the default and remains fully usable. AI is a quiet, optional assistance layer that the citizen intentionally opens without losing their current government context.

The product model is:

Standard portal

→ optional right-side Assistance Workspace

→ contextual generated UI

→ structured citizen review

→ government workflow

→ case tracking.

The guiding principles are:

> Conversational intelligence, graphical interaction.

> Conversation controls the interface. It does not become the interface.

Natural language controls what the workspace presents. The response should normally be the most useful graphical representation of verified context, not a growing transcript.

The government side reflects the system's structure: services, forms, records, notices, returns, payments and workflows. The assistance side reflects the citizen's situation: priorities, deadlines, explanations, relationships, recommended next actions and status.

## No Echo Rule

The Assistance Workspace must not reproduce information merely because it is already visible in the conventional portal. Assistance should present information only when it is needed to interpret verified records, compare records, prioritize what matters, explain a condition, establish evidence or provenance, or recommend or enable an approved action.

Bad redundancy repeats the same Outstanding Demand and amount on both sides without adding meaning. A useful division leaves the official demand, reference, section, processing details and service actions in the portal while Assistance compares the amount paid with the amount recognised and explains the discrepancy.

> The portal presents the government record.
> Assistance interprets relationships across records.

This rule does not prohibit repeating an amount when the value is necessary for a Comparison, SourceTrace, explanation or consequential review.

## Professional Utility Rule

The conventional portal is not a deliberately inferior or beginner-only experience. It must remain a capable hands-on tax workspace for ordinary taxpayers who choose not to use AI, experienced taxpayers, Chartered Accountants and other professional users.

Improving clarity must not remove official tax terminology where professionally useful, direct service access, exact statuses, government references, records, tables, forms, schedules, filters, manual workflows or detailed disclosures.

Where useful, use a dual-label pattern:

- Correct tax-credit details — Tax Credit Mismatch Correction
- Investment gains — Schedule Capital Gains
- Taxes already paid — Schedule Tax Paid

> Organize the machinery; do not hide it.

> The portal is for doing.
> Assistance is for understanding and orchestrating.

---

# Standard Experience

Citizens who do not want AI assistance must still be able to use the government service.

The conventional route allows the citizen to browse:

Dashboard

→ Pending Actions

→ Outstanding Demand

→ View Demand

→ Submit Response

→ Select response

→ Review

→ Submit

The underlying service remains accessible without AI.

---

# AI-Assisted Experience

In the desktop portal-only state, assistance is represented only by a quiet persistent handle on the right edge. Opening it creates one persistent Assistance Workspace beside the current portal page; the portal compresses but does not reload or disappear.

The workspace begins with priorities, deadlines and a persistent natural-language input. Selecting the ₹18,420 Outstanding Demand synchronises both sides: the portal shows the government record while the workspace shows the citizen-facing context.

The citizen can choose **Understand this** or ask a question such as:

> Why is this ₹18,420 showing?

The workspace then selects an approved graphical representation: a comparison of ₹18,420 paid against ₹0 recognised, a plain-language explanation, traceable sources and an approved **Fix this** action. It subsequently supports the corrective action sequence, rigid consequence reviews and persistent case tracking without becoming a chatbot transcript.

---

# AI Assistance Is Optional

The target interaction uses a closed-by-default assistance drawer rather than a large dashboard AI card or toggle as its defining entry point.

When AI assistance is disabled:

- normal portal navigation continues to work;
- government records remain visible;
- forms remain usable;
- deterministic validation continues;
- the Assistance Workspace remains closed and AI-generated explanations and recommendations are not required.

The citizen never loses access to the underlying service.

---

# AI Responsibilities

AI may help with:

- understanding natural language;
- translating government terminology;
- explaining structured evidence;
- summarising discrepancies;
- recommending approved next steps;
- composing approved UI components;
- preparing government actions for review.

AI does not determine authoritative tax amounts.

AI does not independently decide tax liability.

AI does not perform final submissions.

---

# Deterministic Responsibilities

Traditional software remains responsible for:

- tax amounts;
- payment records;
- Assessment Year matching;
- financial comparisons;
- official statuses;
- workflow prerequisites;
- validation;
- submission state.

---

# Citizen Responsibilities

The citizen retains control over:

- whether retrieved information is correct;
- declarations;
- consequential government actions;
- final submissions;
- payments.

---

# Generative UI Principle

Generative UI does not mean that AI writes arbitrary webpages. The assistance layer produces a validated surface specification using approved representations:

- Attention;
- DeadlineCalendar;
- Comparison;
- Explanation;
- SourceTrace;
- Checklist;
- Decision;
- ActionPlan;
- Timeline.

These are representations rather than a catalogue of generic cards. The model may select an approved representation, layout enum, section ordering and supporting copy. Authoritative facts are resolved from deterministic application state through validated `dataRef` bindings. Interactive operations use approved `actionId` values.

As the citizen approaches authorization, the interface becomes deliberately less generative and more rigid. AI cannot rearrange or cross the final review and confirmation boundary.

---

# Design Direction

The target presentation foundation is shadcn/ui and Base UI for structural primitives, Magic UI used selectively for meaningful motion or visual relationships, and project-owned tokens and styling.

The interaction model comes first; the application must not be designed around a component library.

Some legacy presentation components remain to be migrated.

The prototype should feel like a credible evolution of an Indian government digital service rather than a generic AI startup.

AI should be communicated primarily through:

- contextual intelligence;
- clarity;
- adaptive interfaces;
- reduced navigation;
- visible evidence;
- appropriate next actions.

Avoid unnecessary:

- robot imagery;
- chat bubbles;
- sparkles;
- excessive gradients;
- futuristic decorative effects.

The interface should feel calm, trustworthy and understandable.

The desktop Assistance Workspace is specified first. Mobile assistance will be designed separately and must not be implemented by merely compressing the desktop split-screen layout.

---

# Prototype Boundary

This is not connected to the real Income Tax Department.

All:

- taxpayers;
- PAN information;
- tax payments;
- government responses;
- challans;
- returns;
- Form 26AS information;
- submissions;
- API responses

are synthetic or simulated.

The prototype demonstrates the interaction and system architecture rather than accessing live government systems.
