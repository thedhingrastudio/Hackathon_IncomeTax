# Income Tax Assistance Prototype — UX Flow

## Purpose

This document defines the standard and optional assisted journeys for the synthetic ₹18,420 Outstanding Demand scenario. Both experiences use the same records, deterministic reconciliation, workflows, consequence gates, submissions and persistent case state.

The governing principles are:

> Conversational intelligence, graphical interaction.

> Conversation controls the interface. It does not become the interface.

The normal Income Tax portal is the default interface. AI is optional and never replaces access to government services.

## Shared portal structure

The portal provides Dashboard, Returns, Payments and Tax Records, Pending Actions, Services and Help. Only the Outstanding Demand scenario is implemented deeply.

The synthetic citizen is Rohan Mehta. The relevant Assessment Year is 2026–27 and the Outstanding Demand is ₹18,420. All identity, financial and government information is synthetic.

Existing routes may remain as implementation or deep-link details. Conceptually, portal browsing, government workflows and case tracking remain distinct, while the intended assisted desktop experience occurs in one persistent workspace beside the current portal context.

## Experience A — Standard non-AI journey

The conventional route remains:

Dashboard → Pending Actions → Outstanding Demand → Submit Response → Select response → Review → Confirm and submit.

AI must not be required at any point.

### Dashboard and Pending Actions

The Dashboard provides normal navigation, Quick Links or Tools, account information, items needing attention and government advisories or updates. The ₹18,420 Outstanding Demand is the primary attention item.

Pending Actions shows the demand, AY 2026–27 and its official `Action required` status, with a conventional action to view it.

### Outstanding Demand

The demand detail shows the amount, Assessment Year, official status and synthetic processing reference. Standard actions remain **Pay now** and **Submit response**.

The response flow offers:

- Demand is correct;
- Demand was already paid;
- I disagree with this demand.

For this scenario, the appropriate response is **I disagree with this demand**, because the processed return must first be corrected.

### Separate conventional correction

Without assistance, the citizen manually discovers and uses:

Services → Rectification → New Request → AY 2026–27 → Tax Credit Mismatch Correction.

The review shows the existing ₹18,420 payment, payment date 15 July 2026, synthetic challan `MOCK-2481`, correction type, evidence and the message **Nothing has been submitted yet**. Submission requires explicit citizen confirmation and returns `RECT-DEMO-01842`.

The citizen then returns to the demand response, chooses **I disagree with this demand**, cites the filed Rectification, reviews the ₹18,420 disputed amount and explicitly confirms submission. The simulated response reference is `DEMAND-RESP-DEMO-18420`.

This procedural separation is preserved because it demonstrates the government structure that assistance helps the citizen navigate.

## Experience B — Persistent Assistance Workspace

The assisted journey is expressed as seven states of one persistent workspace. It is not a sequence of unrelated AI pages and it does not bypass validation or citizen confirmation.

### State 0 — Portal only

The Income Tax portal occupies the full desktop workspace. Normal navigation, Quick Links or Tools, attention items and government advisories remain available.

AI appears only as a quiet persistent affordance on the right edge. There is no dominant dashboard AI card, permanent chatbot or required AI toggle interaction.

### State 1 — Assistance home

The citizen intentionally opens the drawer. The portal compresses but remains visible on the left; the Assistance Workspace opens on the right at an approximate 47% portal / 53% assistance split.

The Assistance Home contains:

- welcome and current context;
- things that need attention;
- dates to remember or a calendar;
- a persistent natural-language composer at the bottom;
- an optional voice-input affordance.

The composer controls the workspace above it. It does not begin a permanent message transcript.

### State 2 — Context selected

Selecting the ₹18,420 Outstanding Demand attention item synchronises both sides.

Left: the portal navigates to or reveals the actual Outstanding Demand record.

Right: the workspace shows:

**Outstanding demand**

₹18,420 · AY 2026–27

Income Tax is waiting for your response.

Primary contextual action: **Understand why this is showing**.

### State 3 — Understanding

The citizen chooses **Understand this** or asks a question such as **Why is this ₹18,420 showing?**

The workspace selects a Comparison representation:

- You paid: ₹18,420, Confirmed;
- Processed return recognised: ₹0;
- Difference: ₹18,420 not counted.

It then presents the verified explanation:

> The payment exists in Income Tax records but was not included when the return was processed.

Primary action: **Fix this**.

Secondary progressive disclosure: **Why we think this** reveals traceable evidence without requiring blind trust.

### State 4 — Action workspace

After **Fix this**, the workspace shows the approved outcome-oriented sequence:

1. **Correct your tax credit** — the existing ₹18,420 payment has been found, everything required is ready, and the citizen can review the correction.
2. **Respond to the demand** — prepared after Step 1 and started only after the Rectification exists.

Human outcomes appear before government machinery. Government terminology may be shown secondarily, for example `Rectification → Tax Credit Mismatch Correction`.

### State 5 — Review and consequence

As the citizen approaches a consequential action, the experience becomes less generative and more rigid.

Understanding is flexible and adaptive. Authorization is structured and deterministic.

Before each simulated submission, show:

- exactly what will be submitted;
- authoritative Assessment Year and monetary values;
- the government workflow;
- supporting evidence and references;
- **Nothing has been submitted yet**;
- an explicit **Confirm and submit** action.

AI may not rearrange this review, change authoritative values, advance workflow state or cross the confirmation boundary. Rectification must be confirmed before Demand Response can be prepared and confirmed.

### State 6 — Tracking

After both submissions, the same Assistance Workspace becomes the citizen-facing case tracker:

**Outstanding demand · ₹18,420**

**Waiting for Income Tax review**

**Nothing you need to do right now.**

Timeline:

- ✓ Payment found;
- ✓ Problem identified;
- ✓ Correction submitted — `RECT-DEMO-01842`;
- ✓ Demand response submitted — `DEMAND-RESP-DEMO-18420`;
- ● Income Tax review;
- ○ Resolved.

The portal remains usable beside it. The persistent case remains `WAITING_FOR_REVIEW`; the prototype does not automatically resolve it.

## Contextual synchronization

Portal and assistance state are coordinated without merging their responsibilities. Selecting an attention item may update both the government page on the left and the citizen context on the right. Closing assistance returns the portal to its full workspace without discarding the portal route or persisted case.

The left side remains authoritative government structure. The right side explains and orchestrates the citizen's verified situation.

## Persistent composer

The composer remains available at the bottom of Assistance Home and supported contextual surfaces. Examples include:

- Why do I owe this?
- I already paid this.
- What do I need to do this month?
- Do I need to respond to anything?
- Show me proof.
- What happens next?

The interpreted intent changes the representation above the composer. Prior turns may inform context, but a chat-message stack is not the primary output or navigation model.

## Progressive rigidity

The assistance experience deliberately narrows its freedom:

- flexible: natural-language intent and selection of useful context;
- adaptive: comparison, explanation, evidence emphasis and progressive disclosure;
- structured: approved action plan and government workflow information;
- rigid: declarations, authoritative review, confirmation and submission.

The representation layer may help the citizen understand and decide. Deterministic workflow code alone enforces prerequisites and transitions.

## Assistance off

When assistance is unavailable or not invoked, the Dashboard, navigation, records, Outstanding Demand, Rectification, Demand Response, deterministic validation and citizen-controlled submissions remain usable. Closing or disabling assistance does not erase persistent case state or modify authoritative records.

## Accessibility and resilience

All critical controls must be semantic and keyboard accessible, with visible focus, meaningful labels and non-colour-only status communication. Critical content must load before decorative effects, and completed workflow state must recover after reload.

If assistance output fails validation or a safe diagnosis cannot be determined, the interface falls back to the conventional portal and must not invent an explanation or workflow.

## Mobile direction

The desktop Assistance Workspace is specified first. Mobile assistance interaction will be designed separately and must not be implemented by merely compressing the desktop split-screen layout.

Existing critical mobile journeys must remain usable during migration, but this document does not invent the final mobile assistance model.

## Critical desktop demonstration journey

1. Show the full conventional Income Tax portal.
2. Open the quiet Assistance Workspace affordance.
3. Select the ₹18,420 Outstanding Demand attention item.
4. Keep the government demand visible on the left and its citizen context on the right.
5. Ask **Why is this ₹18,420 showing?** or choose **Understand this**.
6. Show the verified ₹18,420 versus ₹0 Comparison and Explanation.
7. Reveal SourceTrace on request.
8. Choose **Fix this** and show the two-step ActionPlan.
9. Review and explicitly confirm Rectification.
10. Review and explicitly confirm Demand Response.
11. Show the persistent Tracking state.
12. Close assistance and demonstrate that the normal portal remains usable.
