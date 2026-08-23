# Income Tax Assistance Prototype — UX Flow

## Purpose

This document defines the user journeys and application states for the hackathon prototype.

The prototype focuses on one synthetic Income Tax problem:

> A taxpayer has already paid ₹18,420 in Self-Assessment Tax, but the processed return recognises ₹0 of that payment and an outstanding demand of ₹18,420 is created.

The service supports two ways of resolving the same underlying problem:

1. Standard government-service navigation without AI.
2. Optional AI-assisted diagnosis and orchestration.

Both experiences operate on the same synthetic taxpayer records and the same simulated government workflows.

---

# Core UX Principle

The citizen should not be required to understand the internal structure of the Income Tax portal before they can understand their problem.

The AI-assisted experience follows:

Intent

→ Context

→ Diagnosis

→ Evidence

→ Action Plan

→ Citizen Review

→ Government Action

→ Case Status

The experience should use:

> Conversational intelligence, graphical interaction.

Natural language may be used to express intent.

The primary experience after intent is understood should consist of normal graphical UI rather than a chat transcript.

---

# Shared Portal Structure

The prototype represents a small subset of the Income Tax portal.

Primary navigation:

* Dashboard
* Returns
* Payments
* Pending Actions
* Services
* Help

Only the Outstanding Demand problem is implemented deeply.

Other areas exist primarily to make the service understandable and browsable.

---

# Prototype User

Name:

Rohan Mehta

Assessment Year:

2026–27

Outstanding Demand:

₹18,420

All personal, financial and government information is synthetic.

---

# Route Model

The intended route structure is:

`/`

Dashboard.

`/returns`

Read-only Returns overview.

`/payments`

Read-only Tax Payments overview.

`/pending-actions`

Pending Actions overview.

`/pending-actions/demand`

Outstanding Demand detail.

`/services`

Services overview.

`/services/rectification`

Relevant Tax Credit Rectification workflow.

`/services/demand-response`

Relevant Response to Outstanding Demand workflow.

`/case/tax-demand-001`

Combined case tracker for the assisted journey.

Routes may evolve during implementation, but the conceptual separation between portal browsing, government workflows and case tracking should remain.

---

# Experience A — Standard Non-AI Journey

## Goal

Allow an experienced taxpayer, accountant or citizen who does not want AI assistance to navigate and complete the underlying government workflow directly.

AI must not be required.

---

## ST-01 — Dashboard

### Purpose

Give the taxpayer an overview of their account.

### Display

Rohan Mehta

Assessment Year 2026–27

Primary navigation.

A prominent account item:

**1 item needs your attention**

Outstanding Demand

₹18,420

Assessment Year 2026–27

### Actions

**View demand**

If AI assistance is enabled, the dashboard may also contain:

**Need help with something?**

This is secondary to the normal portal.

---

## ST-02 — Pending Actions

### Purpose

Show government actions requiring taxpayer attention.

### Display

Outstanding Demand

₹18,420

Assessment Year 2026–27

Status:

Action required

### Action

**View**

---

## ST-03 — Outstanding Demand Detail

### Display

Outstanding Demand

₹18,420

Assessment Year 2026–27

Status:

Action required

Relevant demand reference and synthetic processing information may be shown.

### Standard actions

**Pay now**

**Submit response**

If AI assistance is enabled, additionally show:

**Not sure why this is showing?**

**Help me understand this**

This contextual AI action must disappear when AI assistance is disabled.

---

## ST-04 — Submit Response

The conventional interface asks the taxpayer to choose how they want to respond.

Simplified prototype options:

### Demand is correct

Use when the taxpayer agrees that the amount is payable.

### Demand was already paid

Use when the taxpayer has already paid the demand itself.

### I disagree with this demand

Use when the taxpayer believes the demand is incorrect or another corrective action is underway.

The interface may contain short explanations but should retain the recognisable government classification model.

For this synthetic scenario, the correct eventual route is:

**I disagree with this demand**

because the underlying processed record first needs correction.

---

# Standard Scenario Requires a Separate Correction

The taxpayer must discover that resolving this problem requires a second government service.

They navigate manually:

Services

→ Rectification

→ New Request

→ Assessment Year 2026–27

→ Tax Credit Mismatch Correction

This procedural separation is intentional in the prototype because it demonstrates the complexity the AI-assisted experience is designed to orchestrate.

---

## ST-05 — Services

### Display

A browsable set of government services.

Deep implementation is required only for:

**Rectification**

and:

**Response to Outstanding Demand**

Other services may appear as prototype placeholders.

---

## ST-06 — Rectification

### Display

New Rectification Request

Assessment Year:

2026–27

Request Type:

**Tax Credit Mismatch Correction**

The taxpayer manually chooses the correct service.

### Continue

---

## ST-07 — Tax Credit Correction Form

The taxpayer sees structured tax information.

### Existing payment

₹18,420

15 July 2026

Self-Assessment Tax

Synthetic Challan:

MOCK-2481

### Processed return

Self-Assessment Tax recognised:

₹0

### Correction

Apply the existing Self-Assessment Tax payment to the processed return.

### Action

**Review request**

---

## ST-08 — Rectification Review

The taxpayer sees:

Assessment Year

2026–27

Payment

₹18,420

Payment date

15 July 2026

Challan

MOCK-2481

Correction Type

Tax Credit Mismatch Correction

### Consequence message

Nothing has been submitted yet.

### Action

**Confirm and submit**

---

## ST-09 — Rectification Submitted

The simulated government system returns:

Rectification Request ID:

`RECT-DEMO-01842`

Status:

Submitted

The standard interface should make clear that this is only one part of resolving the demand.

The taxpayer must return to:

Pending Actions

→ Outstanding Demand

→ Submit Response

---

## ST-10 — Demand Response After Rectification

The taxpayer chooses:

**I disagree with this demand**

Reason:

**Rectification filed**

Reference:

`RECT-DEMO-01842`

Amount disputed:

₹18,420

### Action

**Review response**

---

## ST-11 — Demand Response Review

Display:

Outstanding Demand:

₹18,420

Response:

Disagree

Reason:

Rectification filed

Rectification reference:

RECT-DEMO-01842

Amount disputed:

₹18,420

### Consequence message

Nothing has been submitted yet.

### Action

**Confirm and submit**

---

## ST-12 — Demand Response Submitted

Mock response ID:

`DEMAND-RESP-DEMO-18420`

Status:

Submitted

The conventional experience may show the two government submissions separately.

This is intentionally less integrated than the AI-assisted case tracker.

---

# Experience B — AI-Assisted Journey

## Goal

Allow the citizen to begin from their real problem rather than selecting a government procedure.

The AI-assisted journey must use the same underlying synthetic government records and workflows as the standard journey.

It must not bypass validation or final citizen confirmation.

---

# AI Entry Point 1 — Contextual Help

From the Outstanding Demand page:

**Help me understand this**

Because the user is already looking at the demand, the system automatically knows:

* the demand reference;
* Assessment Year;
* amount;
* taxpayer;
* current government state.

The user should not have to repeat this information.

This is the primary hackathon demo entry point.

---

# AI Entry Point 2 — Natural Language

From the dashboard:

**Need help with something?**

Input:

> Tell us what's happened...

Example user input:

> I already paid this tax. Why does it say I owe ₹18,420?

The input may initially be interpreted by a deterministic mock intent system.

A real LLM adapter may be connected later.

After the intent is understood, the experience converges with the contextual-help journey.

Do not create a permanent chat transcript.

---

## AI-01 — Assistance Requested

State:

`ASSISTANCE_REQUESTED`

The interface transitions from the normal government page into an assistance surface.

The surrounding portal remains recognisable.

---

## AI-02 — Checking Records

State:

`CHECKING_RECORDS`

### Purpose

Make system activity understandable without exposing technical implementation details.

### Display

**Checking this demand**

We're comparing the information Income Tax already has.

Progress may include:

✓ Outstanding Demand

✓ Filed return

✓ Tax payments

✓ Form 26AS

✓ Processing result

The system is reading synthetic records only.

No LLM is responsible for financial calculations.

---

## AI-03 — Diagnosis

State:

`DIAGNOSIS_READY`

This is one of the hero moments of the prototype.

### Display

# We found the problem

### Your payment

₹18,420

Paid 15 July 2026

Confirmed

### Processed return

₹0

Self-Assessment Tax recognised

### Difference

₹18,420

### Explanation

Your ₹18,420 payment exists, but it was not included in the return Income Tax processed.

This explanation is based on deterministic reconciliation results.

### Primary action

**Fix this**

### Secondary disclosure

**Why do we think this?**

---

## AI-04 — Evidence

Evidence should be progressively disclosed.

The simplest view shows:

Payment record:

₹18,420 confirmed

Form 26AS:

₹18,420 reflected

Processed return:

₹0 recognised

Outstanding Demand:

₹18,420

A deeper view may reveal:

* synthetic challan reference;
* payment date;
* Assessment Year;
* processing reference;
* record sources.

The citizen should be able to inspect why the system reached its conclusion.

---

## AI-05 — Resolution Plan

State:

`PLAN_READY`

This is the second major hero moment.

### Display

# Here's how we'll fix this

Two actions are required.

### Step 1 — Correct your tax credit

Add your existing ₹18,420 Self-Assessment Tax payment to the processed return.

Evidence ready:

✓ Payment

✓ Form 26AS

Status:

Ready

### Step 2 — Respond to the demand

Tell Income Tax that the ₹18,420 demand is being corrected.

This step begins after the rectification request exists.

### Action

**Review step 1**

The citizen sees one outcome-oriented workflow rather than having to discover two separate services.

---

## AI-06 — Rectification Review

State:

`RECTIFICATION_REVIEW`

At this point the interface becomes deliberately more rigid and form-like.

AI has finished assisting.

The citizen is now reviewing a government action.

### Display

Assessment Year:

2026–27

Existing payment:

₹18,420

Payment date:

15 July 2026

Synthetic challan:

MOCK-2481

Correction:

Tax Credit Mismatch Correction

### Evidence

Payment confirmed

Form 26AS reflected

### Consequence message

Nothing has been submitted yet.

### Confirmation

The citizen explicitly confirms that the information is correct.

### Action

**Confirm and submit correction**

---

## AI-07 — Rectification Submitted

State:

`RECTIFICATION_SUBMITTED`

Mock Rectification ID:

`RECT-DEMO-01842`

Status:

Submitted

The orchestrator now has the prerequisite needed for the second government action.

The user should not have to manually return to another portal section.

---

## AI-08 — Demand Response Prepared

State:

`DEMAND_RESPONSE_REVIEW`

### Display

# One final action

Your tax-credit correction has been submitted.

We can now respond to the ₹18,420 demand.

### Prepared response

Response:

Disagree with demand

Reason:

Rectification filed

Rectification reference:

RECT-DEMO-01842

Amount disputed:

₹18,420

### Plain-language explanation

We're telling Income Tax that this demand is being corrected because the tax payment already exists.

### Consequence message

Nothing has been submitted yet.

### Action

**Confirm and submit response**

---

## AI-09 — Demand Response Submitted

State:

`DEMAND_RESPONSE_SUBMITTED`

Mock response reference:

`DEMAND-RESP-DEMO-18420`

The citizen has now completed both government actions.

---

## AI-10 — Combined Case Tracker

Route:

`/case/tax-demand-001`

State:

`WAITING_FOR_REVIEW`

### Display

# Your ₹18,420 tax demand

We're fixing this.

Timeline:

✓ Payment found

15 July 2026

✓ Rectification submitted

RECT-DEMO-01842

✓ Demand response submitted

DEMAND-RESP-DEMO-18420

● Income Tax review

Waiting

○ Resolved

### Reassurance

No action is required from you right now in this simulated case.

### Secondary action

**View details**

This screen should feel like a persistent mini-application for the citizen's specific problem.

It should not resemble a chat conversation.

---

## AI-11 — Resolved State

State:

`RESOLVED`

The case tracker updates to:

✓ Payment found

✓ Rectification submitted

✓ Demand response submitted

✓ Income Tax review completed

✓ Demand resolved

Outstanding Demand:

₹0

The resolution is simulated.

---

# AI Assistance Toggle

AI assistance must be optional.

The setting may initially be stored in localStorage.

Example:

`aiAssistanceEnabled = true`

or:

`aiAssistanceEnabled = false`

---

## AI Assistance On

May show:

* contextual help;
* dashboard natural-language input;
* generated diagnosis;
* generated evidence;
* generated action plan.

---

## AI Assistance Off

Must remove:

* natural-language assistance;
* contextual AI help;
* AI diagnosis;
* AI recommendations.

Must retain:

* dashboard;
* navigation;
* returns;
* payments;
* pending actions;
* demand detail;
* government forms;
* deterministic validations.

Turning AI off must not break the service.

---

# Progressive Rigidity

The AI-assisted interface should become more structured as the user approaches a consequential action.

## Soft

Intent input.

Example:

> I already paid this.

## Adaptive

Diagnosis.

Evidence.

Comparisons.

Recommended action plan.

## Structured

Rectification details.

Demand-response details.

## Rigid

Declarations.

Final confirmation.

Government submission.

This progression should be reflected visually.

---

# Generative UI Surfaces

The experience should be thought of as surfaces rather than a sequence of chat messages.

## Intent Surface

What problem is the citizen trying to solve?

## Understanding Surface

What records is the system examining?

## Evidence Surface

What did the system find?

## Action Surface

What needs to happen?

## Consequence Surface

What exactly is the citizen authorising?

## Case Surface

What is happening after submission?

---

# Core UI Blocks

Initial trusted Generative UI components may include:

`NoticeBlock`

`SourceCheckBlock`

`AmountComparisonBlock`

`DiagnosisBlock`

`EvidenceBlock`

`ActionPlanBlock`

`ReviewBlock`

`TimelineBlock`

These components are controlled by the application.

The assistance engine may compose them but may not generate unrestricted interface code.

---

# Mobile Behaviour

All critical flows must work on a narrow mobile viewport.

On mobile:

* content becomes single-column;
* tables should become stacked comparisons where necessary;
* primary actions remain easy to reach;
* touch targets remain large;
* critical information must not require horizontal scrolling;
* contextual assistance remains available when AI is enabled.

---

# Accessibility Behaviour

All critical actions must be keyboard accessible.

Do not rely only on colour to communicate:

* payment confirmed;
* mismatch;
* warning;
* success;
* progress.

Focus states must remain visible.

Plain-language explanations should precede government terminology where possible.

---

# Slow Connection Behaviour

Critical content should load before decorative content.

The user should not lose completed government-action state after a reload.

Eventually show:

> Your progress is saved.

when relevant.

---

# Critical Demo Journey

The strongest presentation path is:

1. Show the normal Income Tax portal.
2. Open the ₹18,420 Outstanding Demand.
3. Briefly show the conventional response options.
4. Return to the demand.
5. Select **Help me understand this**.
6. Show the records being checked.
7. Reveal the ₹18,420 versus ₹0 comparison.
8. Reveal the two-step corrective plan.
9. Review and submit the Rectification.
10. Review and submit the Demand Response.
11. Show the combined case tracker.
12. Briefly disable AI and demonstrate that normal portal usage remains available.

This is the hero experience around which implementation and visual polish should be prioritised.
