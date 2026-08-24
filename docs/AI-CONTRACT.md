# Income Tax Assistance Prototype — AI Contract

## Purpose

This document defines the boundary between artificial intelligence, deterministic application logic, government workflow logic, and citizen-controlled actions.

The prototype uses AI as an optional assistance layer.

AI is not the source of truth.

AI is not the tax calculation engine.

AI is not authorised to perform consequential government actions.

The governing principle is:

> AI understands and explains. Deterministic software verifies. The citizen decides.

---

# Core Interaction Model

The AI-assisted experience follows:

Citizen Intent

→ Case Context

→ Deterministic Reconciliation

→ Evidence Packet

→ Assistance Engine

→ Structured UI Plan

→ Validation

→ Trusted Graphical Interface

→ Citizen Review

→ Government Workflow

The product should use:

> Conversational intelligence, graphical interaction.

> Conversation controls the interface. It does not become the interface.

A conversational input may begin the interaction.

The output should normally become structured graphical UI rather than a long chat conversation.

---

# Assistance Providers

The application must support a provider abstraction.

Initial implementation:

`MockAssistanceEngine`

Future implementation:

`OpenAIAssistanceEngine`

Both providers must return compatible structured output.

The presentation layer must not depend directly on a particular AI provider.

---

# Prototype Provider

Initial environment:

`AI_PROVIDER=mock`

The Mock Assistance Engine should return predictable output for the hackathon scenario.

It must use the same data structures and UI schemas expected from a future live model.

The mock provider exists so that the full AI-assisted experience can be demonstrated without:

* external API availability;
* latency;
* API cost;
* network dependency;
* model variability.

---

# Future OpenAI Provider

Future environment:

`AI_PROVIDER=openai`

Expected server-side environment variables:

`OPENAI_API_KEY`

`OPENAI_MODEL`

API credentials must never be exposed in client-side JavaScript.

API credentials must never be committed to Git.

The OpenAI provider should operate only through a server-side boundary.

---

# Inputs Available to the Assistance Engine

The assistance engine may receive:

## Citizen Intent

Examples:

> I already paid this tax.

> Why does it say I owe ₹18,420?

> I don't understand this demand.

---

## Current Page Context

Examples:

* current demand ID;
* Assessment Year;
* current workflow state;
* currently viewed service.

If the citizen asks for contextual help from the Outstanding Demand page, they should not have to repeat information the application already knows.

---

## Evidence Packet

The Evidence Packet is generated from deterministic application logic.

It may include:

* payment amount;
* payment date;
* payment status;
* Assessment Year;
* Form 26AS status;
* processed-return amount;
* outstanding-demand amount;
* deterministic discrepancy;
* deterministic diagnosis;
* evidence references.

The AI may explain this information.

The AI may not change it.

---

## Approved Workflow Options

The rules engine provides the set of workflows available for the diagnosed case.

For the initial scenario:

1. `tax_credit_rectification`
2. `respond_to_demand`

The AI may explain or present these workflows.

The AI may not invent additional government workflow identifiers.

---

## Available Representations

The application provides the assistance engine with the approved representation types, variants and permitted surface/layout combinations. The engine may select only from this input; a representation is not valid merely because a model names it.

## Approved Actions

The application provides the current set of approved `actionId` values and their availability for the present workflow state. The model may suggest a label for an approved action, but it cannot add an action, make an unavailable action valid or execute it.

---

# AI May

AI may:

* interpret natural-language intent;
* classify a citizen request into an approved intent;
* translate government terminology into plain language;
* summarise structured tax records;
* explain a deterministic discrepancy;
* explain why the system reached a diagnosis;
* recommend an approved workflow;
* prepare information for citizen review;
* compose an approved set of Generative UI representations;
* determine an appropriate level of explanation;
* generate plain-language supporting copy;
* ask for missing information when the approved workflow requires it.
* choose an approved representation and layout variant;
* prioritise verified evidence;
* decide progressive disclosure;
* order approved informational sections within permitted bounds.

---

# AI Must Not

AI must not:

* calculate authoritative tax amounts;
* determine final tax liability independently;
* invent tax records;
* modify tax records;
* invent payments;
* invent Form 26AS entries;
* invent government statuses;
* invent government procedures;
* invent legal requirements;
* create arbitrary government action identifiers;
* make payments;
* submit a Rectification automatically;
* submit a Demand Response automatically;
* accept declarations for the citizen;
* cross a consequence boundary without explicit user action;
* directly alter workflow state;
* directly write arbitrary HTML or React for runtime rendering.

---

# Deterministic Responsibilities

Deterministic application code is responsible for:

* financial arithmetic;
* Assessment Year matching;
* payment matching;
* authoritative deadlines and whether they apply;
* determining whether an item genuinely requires attention;
* official statuses and record relationships;
* identifying record mismatches;
* calculating the ₹18,420 discrepancy;
* checking payment status;
* validating Form 26AS state;
* validating processed-return state;
* identifying supported diagnoses;
* mapping diagnoses to approved workflows;
* validating workflow prerequisites;
* enforcing case-state transitions;
* creating simulated submission references.

The assistance engine receives these results.

It does not recreate them.

---

# Initial Deterministic Diagnosis

The initial supported diagnosis is:

`payment_missing_from_processed_return`

It is produced only when the deterministic reconciliation rules support it.

The assistance engine must not assign this diagnosis merely because the citizen says:

> I already paid.

The user's statement triggers investigation.

The records determine the diagnosis.

---

# Citizen Responsibilities

The citizen remains responsible for:

* confirming that retrieved information is correct;
* reviewing evidence;
* reviewing proposed government actions;
* making declarations;
* confirming Rectification submission;
* confirming Demand Response submission;
* making any future payments.

The prototype must always distinguish:

**AI recommendation**

from:

**citizen-authorised action**.

---

# Generative UI Contract

Generative UI uses structured data.

It does not use unrestricted runtime code generation.

The target V2 flow is:

Assistance Engine

→ Surface Specification

→ Zod Validation

→ Trusted Representation Registry

→ `dataRef` Binding Resolution

→ Assistance Workspace

The model may choose from approved representations, surfaces and layout enums.

The model may not create arbitrary executable components.

---

# Approved Representation Grammar

The V2 representation grammar is:

`Attention` — what genuinely requires the citizen's attention.

`DeadlineCalendar` — when the citizen needs to care.

`Comparison` — what differs between verified records.

`Explanation` — what a verified condition means in plain language.

`SourceTrace` — why the citizen should believe the explanation.

`Checklist` — whether prerequisites and evidence are available.

`Decision` — what genuine choice remains with the citizen.

`ActionPlan` — what approved sequence needs to happen.

`Timeline` — what has happened and what is happening now.

These are representations, not nine generic rectangular cards. Additional types require an explicit product decision and schema change before implementation.

# Surface, Field and Layout Vocabulary

Approved surface types are `home`, `understanding`, `decision`, `action`, `review` and `status`.

Structured fields fall into four categories:

`dataRef` — a reference to deterministic application data, such as `evidence.payment.amount`.

`copy` — human-facing supporting language that may be model-generated.

`enum` — a controlled choice such as an approved representation, variant or layout.

`actionId` — an application-approved action identifier.

Approved layout enums are `stack`, `split`, `hero-detail`, `compact-grid` and `progressive`. The model may not output arbitrary widths, positions, CSS values or animation instructions.

---

# Approved Initial Action Types

The initial approved action identifiers are:

`view_demand`

`request_assistance`

`view_evidence`

`tax_credit_rectification`

`respond_to_demand`

`review_rectification`

`submit_rectification`

`review_demand_response`

`submit_demand_response`

`view_case`

New action identifiers must not be accepted merely because an AI response contains them.

They must first be added to the application's approved schema and workflow rules.

---

# Structured Output

The exact implementation schema may evolve, but an assistance response should conceptually contain:

* case ID;
* recognised intent;
* diagnosis;
* plain-language summary;
* approved representations;
* approved actions;
* missing information;
* warnings if relevant.

Example conceptual output:

```json
{
  "surface": "understanding",
  "layout": "stack",
  "blocks": [
    {
      "type": "comparison",
      "variant": "financial_mismatch",
      "items": [
        {
          "label": "You paid",
          "valueRef": "evidence.payment.amount",
          "statusRef": "evidence.payment.status"
        },
        {
          "label": "Processed return",
          "valueRef": "evidence.processedReturn.recognisedTax"
        }
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
    },
    {
      "type": "action_plan",
      "workflowRef": "approvedResolution"
    }
  ],
  "primaryAction": {
    "actionId": "review_rectification",
    "label": "Fix this"
  }
}
```

This example is illustrative.

The actual runtime schema must be defined and validated in code.

This is a target V2 contract. The current runtime schema remains unchanged until a separate implementation task migrates it.

---

# Validation Boundary

All AI-generated structured output must be validated before it reaches the UI renderer.

Use Zod.

If validation fails:

1. Do not attempt to partially execute malformed AI instructions.
2. Do not render unknown executable actions.
3. Fall back to the standard government portal experience.
4. Where appropriate, tell the citizen that automated assistance is temporarily unavailable.

---

# Unsupported Diagnosis

If the deterministic system cannot safely identify the reason for a demand, the AI must not invent one.

Display something equivalent to:

> We found the demand, but we couldn't safely determine why it exists from the information available.

Possible next actions may include:

* inspect records;
* use the normal portal workflow;
* provide missing evidence;
* seek appropriate professional or government assistance.

---

# Evidence Principle

Every important AI explanation should be traceable to structured evidence.

The citizen should be able to ask:

> Why do you think this?

The application should then reveal the relevant records.

For the initial scenario:

Payment:

₹18,420 confirmed

Form 26AS:

₹18,420 reflected

Processed Return:

₹0 recognised

Outstanding Demand:

₹18,420

The system should make this discrepancy visible rather than requiring blind trust in the model.

---

# Consequence Boundary

AI assistance becomes more constrained as the user approaches a consequential government action.

## Flexible

Natural-language intent.

## Adaptive

Diagnosis.

Evidence.

Action-plan composition.

## Structured

Government workflow information.

## Rigid

Declaration.

Review.

Confirmation.

Submission.

AI must never autonomously cross from recommendation into submission.

---

# AI Assistance Off

AI assistance is optional.

When disabled:

* natural-language assistance is hidden;
* contextual AI help is hidden;
* AI-generated diagnosis is hidden;
* AI-generated action-plan composition is hidden.

The following remain available:

* dashboard;
* normal navigation;
* tax records;
* Outstanding Demand;
* Rectification;
* Demand Response;
* deterministic validation;
* citizen-controlled submission.

AI must not become a mandatory gatekeeper.

---

# Privacy and Data Principle

The hackathon uses synthetic data only.

A future production system would require strict handling of tax and identity information.

The architecture should therefore minimise unnecessary data exposure to the assistance provider.

Where possible, provide models with a structured Evidence Packet rather than unrestricted access to entire taxpayer records.

---

# Development Rule

When implementing AI-related functionality:

1. Use the mock provider first.
2. Make the entire user journey work without a live model.
3. Validate all structured output.
4. Keep calculations deterministic.
5. Keep government actions outside the model.
6. Keep user confirmation explicit.
7. Preserve the non-AI fallback.
8. Add a live provider only after the trusted architecture works.

The success of this prototype should come from the interaction architecture, not dependence on a particular model.
