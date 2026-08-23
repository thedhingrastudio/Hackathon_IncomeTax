# Project Scope

## Scope Principle

This hackathon project solves one clearly defined problem.

It is not a redesign or recreation of the complete Income Tax e-Filing portal.

The prototype should demonstrate one end-to-end journey deeply enough that the user can understand the problem, resolve it and track the outcome.

---

# Primary User Problem

The taxpayer has already paid ₹18,420 in Self-Assessment Tax.

The processed return recognises ₹0.

An outstanding demand of ₹18,420 is created.

The taxpayer needs to understand:

1. why the demand exists;
2. whether the payment already exists;
3. what needs to be corrected;
4. which government actions are necessary;
5. what information will be submitted;
6. whether the issue has been resolved.

---

# In Scope

## Portal Shell

Build enough of a modern Income Tax portal for the prototype to feel like a real service.

Primary navigation may include:

- Dashboard
- Returns
- Payments
- Pending Actions
- Services
- Help

Not every section needs deep functionality.

---

## Dashboard

The dashboard should show:

- synthetic taxpayer identity;
- relevant Assessment Year;
- important account information;
- one outstanding demand requiring attention;
- access to normal navigation;
- optional AI assistance.

---

## Returns

A read-only view of the synthetic AY 2026–27 return.

Only data relevant to the demo scenario is required.

---

## Payments

A read-only view showing the ₹18,420 Self-Assessment Tax payment.

---

## Form 26AS

The system must contain synthetic Form 26AS data indicating that ₹18,420 is reflected.

This information may appear as supporting evidence rather than requiring a full Form 26AS page.

---

## Outstanding Demand

This is the primary deep workflow.

The user must be able to:

- view the demand;
- understand the amount;
- use the standard response route;
- request contextual AI assistance;
- review evidence;
- begin the corrective process.

---

## Standard Non-AI Flow

The prototype must provide a conventional route that does not require AI.

The core journey is:

Dashboard

→ Pending Actions

→ Outstanding Demand

→ Submit Response

→ Select response option

→ Provide relevant information

→ Review

→ Mock submission

This flow may be simplified but must remain recognisably conventional.

---

## AI-Assisted Flow

The prototype must support:

Dashboard or Outstanding Demand

→ Ask for help

→ Retrieve synthetic case context

→ Deterministically reconcile records

→ Explain the discrepancy

→ Show evidence

→ Generate an approved corrective workflow

→ Review Rectification

→ Confirm Rectification

→ Mock submission

→ Review Response to Outstanding Demand

→ Confirm

→ Mock submission

→ Case tracker

---

## AI On / Off

The user must be able to disable AI assistance.

The underlying portal remains usable when AI assistance is disabled.

---

## Deterministic Reconciliation

The application must programmatically establish the discrepancy from synthetic records.

It must not rely on an LLM to calculate the difference.

Initial supported diagnosis:

`payment_missing_from_processed_return`

---

## Tax Credit Rectification

Only the portion needed for the synthetic scenario needs to be implemented.

The system should prepare:

- Assessment Year;
- existing payment;
- payment date;
- synthetic challan reference;
- correction type;
- review;
- confirmation;
- simulated submission.

---

## Response to Outstanding Demand

Only the portion needed for this scenario needs to be implemented deeply.

The system should use the preceding rectification state when preparing the demand response.

---

## Case Tracking

After submissions, the citizen should see a combined case tracker.

Example:

Payment found

→ Rectification submitted

→ Demand response submitted

→ Income Tax review

→ Resolved

State should eventually persist across page reloads.

---

## UX4G

Use UX4G as the primary government design-system foundation.

Custom components may be created where the generative interface needs patterns that UX4G does not provide.

---

## Responsive Experience

The prototype must work on:

- desktop;
- tablet;
- mobile.

The experience should remain usable on smaller mobile screens.

---

## Accessibility

The prototype should follow UX4G accessibility guidance and target WCAG 2.1 AA.

---

## Synthetic Data

All data must be fictional.

No real:

- PAN;
- Aadhaar;
- bank data;
- tax return;
- payment;
- government API;
- government authentication

should be required.

---

# Explicitly Out of Scope

Do not build the full Income Tax e-Filing portal.

Do not deeply implement:

- complete ITR filing;
- every ITR form;
- refunds;
- AIS;
- complete Form 26AS;
- complete e-Pay Tax;
- complete profile management;
- grievance systems;
- PAN services;
- TDS filing;
- appeals;
- all notices;
- Assessing Officer workflows;
- every Rectification type;
- every Outstanding Demand reason.

---

# AI Features Out of Scope for Initial MVP

Do not initially depend on:

- live OpenAI API;
- voice;
- OCR;
- uploaded real tax documents;
- autonomous browser operation;
- unrestricted agent actions.

The architecture may support these later.

---

# Future-Compatible Architecture

The project should make it possible to later add:

- real natural-language intent handling;
- OpenAI API integration;
- additional tax scenarios;
- synthetic document uploads;
- structured document extraction;
- additional generative UI compositions;
- multilingual interaction;
- voice input;
- government API adapters.

These future capabilities should not complicate the hackathon MVP.

---

# Prototype Completion Criteria

The core prototype is complete when a judge can:

1. enter the mock Income Tax portal;
2. browse it normally;
3. find the ₹18,420 outstanding demand;
4. experience the conventional response route;
5. return and request AI assistance;
6. see the system inspect relevant records;
7. understand why the demand exists;
8. inspect the supporting evidence;
9. understand the two-step corrective plan;
10. review and confirm a simulated Tax Credit Rectification;
11. review and confirm a simulated Demand Response;
12. see both processes represented in one case tracker;
13. disable AI assistance and confirm that normal portal usage still works.