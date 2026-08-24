# Income Tax Assistance Prototype — Decision Log

This document records important product, architecture and design decisions.

The purpose is to preserve reasoning as the project evolves and prevent later implementation work from silently reversing decisions.

---

## DEC-001 — Solve One Income Tax Problem

**Status:** Accepted
**Date:** 23 August 2026

The hackathon prototype will not redesign the entire Income Tax portal.

The primary scenario is:

A taxpayer has already paid ₹18,420 in Self-Assessment Tax, but the processed return recognises ₹0, resulting in an outstanding demand of ₹18,420.

The project will demonstrate this one problem end-to-end.

---

## DEC-002 — Preserve Normal Portal Navigation

**Status:** Accepted
**Date:** 23 August 2026

The prototype will remain browsable as a conventional government service.

AI assistance will not replace normal navigation.

The user may access:

* Dashboard
* Returns
* Payments
* Pending Actions
* Services
* Help

Only the Outstanding Demand scenario is deeply implemented.

---

## DEC-003 — AI Assistance Must Be Optional

**Status:** Accepted
**Date:** 23 August 2026

Users must be able to turn AI assistance off.

When disabled, the underlying government service must remain functional.

AI is an assistance layer, not a mandatory intermediary.

---

## DEC-004 — Contextual AI Is the Primary Demo Entry Point

**Status:** Superseded
**Superseded by:** DEC-016
**Date:** 23 August 2026

The primary AI-assisted demo begins from the Outstanding Demand page with:

> Help me understand this

This is preferred over starting the entire application with a blank chatbot prompt because the system already possesses useful context.

A secondary natural-language entry point may exist on the dashboard.

---

## DEC-005 — No Chatbot-First Interface

**Status:** Accepted
**Date:** 23 August 2026

The project follows:

> Conversational intelligence, graphical interaction.

Natural language may be used as input.

Once the system understands the problem, it should use graphical components such as comparisons, evidence, action plans, forms and timelines.

A permanent chat transcript is not the primary interaction model.

---

## DEC-006 — UX4G Is the Design-System Foundation

**Status:** Superseded
**Superseded by:** DEC-015
**Date:** 23 August 2026

The application will use UX4G as the government UI foundation.

Custom AI-native components may be created when UX4G does not provide the required interaction.

The final interface should feel like a credible evolution of an Indian government service rather than a generic AI startup.

---

## DEC-007 — Financial Logic Is Deterministic

**Status:** Accepted
**Date:** 23 August 2026

The AI layer will not calculate authoritative tax amounts.

The ₹18,420 discrepancy must be produced by deterministic reconciliation code using synthetic records.

AI may explain the result.

---

## DEC-008 — AI Cannot Invent Government Workflows

**Status:** Accepted
**Date:** 23 August 2026

The rules engine maps supported diagnoses to approved government workflows.

For the initial scenario:

`payment_missing_from_processed_return`

maps to:

1. `tax_credit_rectification`
2. `respond_to_demand`

AI may explain and compose these actions but may not invent additional procedures at runtime.

---

## DEC-009 — Generative UI Uses Trusted Components

**Status:** Accepted
**Date:** 23 August 2026

The AI layer will not generate arbitrary HTML, React or executable UI.

It will return structured UI blocks.

Those blocks will be validated and rendered through an approved component catalogue.

The composition may be generative.

The design system remains controlled.

---

## DEC-010 — Consequential Actions Require Explicit Confirmation

**Status:** Accepted
**Date:** 23 August 2026

AI may prepare a Rectification or Demand Response.

It may not submit either.

Before submission, the citizen must see what will be sent and explicitly confirm the action.

---

## DEC-011 — Mock Intelligence Before Live AI

**Status:** Accepted
**Date:** 23 August 2026

The complete prototype will first be implemented using a Mock Assistance Engine.

A future OpenAI adapter will implement the same contract.

This keeps the hackathon demo reliable while preserving a credible path toward real generative behaviour.

---

## DEC-012 — Synthetic Data Only

**Status:** Accepted
**Date:** 23 August 2026

No real PAN, tax payment, return, Form 26AS record, Income Tax account, government API or taxpayer data will be used.

All records and government responses are simulated.

---

## DEC-013 — Same Government Workflows for Standard and Assisted Modes

**Status:** Accepted
**Date:** 23 August 2026

The standard and AI-assisted experiences will not use separate mock backends.

Both routes eventually use the same:

* records;
* validation;
* workflow engine;
* confirmation boundaries;
* simulated submissions.

Only the interaction model differs.

---

## DEC-014 — Build Foundation Manually, Then Use Codex Incrementally

**Status:** Accepted
**Date:** 23 August 2026

The repository architecture, product rules, data boundaries and documentation will be created before Codex receives implementation tasks.

Codex will then work increment-by-increment.

Codex should not autonomously redefine:

* product scope;
* AI boundaries;
* workflow architecture;
* data model;
* core UX philosophy.

Each increment should be reviewed before continuing.

---

## DEC-015 — Presentation Foundation Migrates Away From UX4G

**Status:** Accepted
**Date:** 24 August 2026

**Decision:**

The target presentation foundation is shadcn/ui for structural primitives, Magic UI used selectively for meaningful motion and visual relationships, and project-owned product tokens and styling.

The interaction model comes before the component library. The product must continue to feel like a credible and trustworthy public service.

**Reason:**

The product requires a more flexible adaptive workspace and visual language than the previous UX4G-based direction provided.

This decision does not change deterministic reconciliation, data authority, workflow semantics, consequence gates, persistent case state or the conventional non-AI journey.

**Migration note:**

UX4G code and dependencies remain in the current implementation. This decision defines the target and does not claim that migration is complete.

---

## DEC-016 — Assistance Is a Persistent Contextual Workspace

**Status:** Accepted
**Date:** 24 August 2026

**Decision:**

AI assistance lives in a quiet, closed-by-default right drawer. When intentionally invoked on desktop, it opens into an approximate 47% portal / 53% assistance workspace while preserving the current government page on the left.

The government side reflects the system's structure. The assistance side reflects the citizen's situation. The assisted journey progresses through states of one persistent workspace rather than unrelated AI pages.

The desktop model does not define mobile. Mobile assistance must be designed separately and must not merely shrink the desktop split-screen layout.

---

## DEC-017 — Conversation Controls the Interface

**Status:** Accepted
**Date:** 24 August 2026

**Decision:**

Natural language is a persistent control/input for the Assistance Workspace. Responses primarily change the graphical representation above the composer rather than accumulating as a chat transcript.

Conversation may select context, request an explanation, reveal evidence or suggest an approved next action. It is not the primary rendered interface.

---

## DEC-018 — Generative UI Uses Representations and Data Bindings

**Status:** Accepted
**Date:** 24 August 2026

**Decision:**

The model chooses from approved representations, surfaces and layouts and may generate supporting copy. Authoritative facts are referenced through validated `dataRef` bindings and supplied by deterministic application state. Interactive operations use an Approved Action Registry and validated `actionId` values.

The model cannot generate arbitrary HTML, React, CSS, animation code, authoritative facts or government actions.

---

# Adding Future Decisions

New entries should use:

`DEC-XXX — Decision Name`

Include:

**Status**

**Date**

**Decision**

and, when useful:

**Reason**

Do not delete older accepted decisions when the project changes.

Mark them superseded and reference the newer decision.
