# Current Income Tax Portal — Capability Parity Map

## Purpose

This document tracks how the current Income Tax e-Filing portal's major taxpayer capabilities are represented in this prototype.

The redesign is intended to simplify how citizens discover and complete government services.

It must not achieve simplicity merely by deleting important government capabilities.

The prototype therefore distinguishes between:

1. capability representation;
2. prototype-level representation;
3. deep functional implementation.

Only the hackathon's core Outstanding Demand scenario is implemented deeply.

---

# Scope of This Map

This map focuses on the major post-login capabilities documented for a registered individual taxpayer on the Income Tax e-Filing portal.

The real portal contains role-specific and specialised functions that may vary by taxpayer type, permissions and government updates.

This document is therefore a product-parity guide, not an exhaustive specification of every Income Tax Department system.

Current official taxpayer navigation includes major areas such as:

- e-File
- Authorized Partners
- Services
- AIS
- Pending Actions
- Grievances
- Help

Our redesign may reorganise these capabilities into a clearer information architecture.

Capability parity does not require navigation parity.

---

# Product Principle

The current portal often requires citizens to first understand where a government procedure lives.

The redesign should instead organise services around understandable citizen tasks.

We therefore aim for:

**Current capability preserved**

→ **simpler location**

→ **clearer description**

→ **deep implementation only where relevant to the hackathon scenario**

---

# Parity Levels

## Full

The capability is implemented sufficiently for the hackathon's end-to-end journey.

## Read-only

Realistic synthetic information is visible, but the government action itself is not fully implemented.

## Placeholder

The capability is discoverable in the redesigned service catalogue, but the workflow is intentionally outside the hackathon scope.

## External / represented

The real Income Tax service may redirect to another government system. The prototype represents the destination but does not reproduce the external system.

---

# Capability Map

| Current Income Tax capability | Proposed location in redesign | Prototype depth | Notes |
| --- | --- | --- | --- |
| Dashboard | Dashboard | Read-only / contextual | Main account overview and attention items |
| File Income Tax Return | Returns / Services | Placeholder | Full ITR filing is outside scope |
| View Filed Returns | Returns | Read-only | AY 2026–27 synthetic return implemented |
| e-Verify Return | Returns / Services | Placeholder | Preserve discoverability |
| View Form 26AS | Payments & Tax Records | Read-only | Synthetic Form 26AS record used by core scenario |
| Download Pre-filled JSON | Returns / Services | Placeholder | Outside core journey |
| File Income Tax Forms | Services | Placeholder | Outside core journey |
| View Filed Forms | Services | Placeholder | Outside core journey |
| e-Pay Tax | Payments & Tax Records | Placeholder | No real payments in prototype |
| Tax Evasion / Benami Property Petition | Services | Placeholder | Preserve capability only |
| AIS | Payments & Tax Records | Placeholder | Represent as tax-information service |
| My e-Return Intermediary | Services → People & permissions | Placeholder | Preserve capability |
| My Chartered Accountant | Services → People & permissions | Placeholder | Preserve capability |
| Register as Representative Assessee | Services → People & permissions | Placeholder | Preserve capability |
| Act on behalf of another person | Services → People & permissions | Placeholder | Preserve capability |
| Authorise another person | Services → People & permissions | Placeholder | Preserve capability |
| Tax Credit Mismatch | Services → Correct something | Read-only / relevant | Core scenario depends on tax-credit mismatch concepts |
| Rectification | Services → Correct something | **Full in later increment** | Core corrective workflow |
| Refund Reissue | Services → Correct something | Placeholder | Outside core scenario |
| Condonation Request | Services → Correct something | Placeholder | Outside core scenario |
| Exempt PAN from quoting Aadhaar | Services | Placeholder | Preserve discoverability |
| Challan Correction | Services → Correct something | Placeholder | Related but not required for current scenario |
| Generate EVC | Services | Placeholder | Outside core scenario |
| Manage ITDREIN | Services | Placeholder | Specialist service |
| View / Download e-PAN | Services | Placeholder | Outside core scenario |
| Worklist | Pending Actions | Placeholder | Represent conventional pending-work model |
| Response to Outstanding Demand | Pending Actions | **Full** | Primary hackathon journey |
| e-Proceedings | Pending Actions | Placeholder | Preserve capability |
| Compliance Portal | Pending Actions | External / represented | Do not reproduce external portal |
| Reporting Portal | Pending Actions / Services | External / represented | Do not reproduce external portal |
| Submit Grievance | Help & Support / Services | Placeholder | Preserve capability |
| Grievance Status | Help & Support / Services | Placeholder | Preserve capability |
| Help / FAQs / Manuals | Help | Lightweight | Prototype help page |

---

# Redesigned Primary Navigation

The redesigned portal does not need to reproduce the existing navigation labels exactly.

Proposed primary navigation:

- Dashboard
- Returns
- Payments & Tax Records
- Pending Actions
- Services
- Help

The purpose is to reduce top-level navigation complexity while maintaining service discoverability.

---

# Returns

The Returns area should focus on:

- filed returns;
- processing status;
- relevant return amounts;
- return references;
- filing-related actions.

For the core synthetic case:

Tax liability:

₹18,420

Self-Assessment Tax claimed:

₹0

Processing status:

Processed

This page should present the return record neutrally.

It should not automatically reconcile the return against other government records.

---

# Payments & Tax Records

The current prototype's `Payments` area should evolve into:

**Payments & Tax Records**

It may contain:

## Tax payments

Synthetic Self-Assessment Tax payment:

₹18,420

15 July 2026

Confirmed

MOCK-2481

## Form 26AS

A separate read-only record / destination.

Synthetic Self-Assessment Tax reflected:

₹18,420

## AIS

Represented as an available tax-information service.

Full AIS implementation is outside the hackathon scope.

This organisation allows citizens to find related tax records without placing the diagnostic comparison directly on the Returns screen.

---

# Pending Actions

Represent major current pending-action concepts:

## Outstanding Demand

**Full hackathon implementation**

## Worklist

Placeholder

## e-Proceedings

Placeholder

## Compliance Portal

External-service representation

## Reporting Portal

External-service representation

The Outstanding Demand remains visually prominent when action is required.

---

# Services Catalogue

The Services page should act as the broad capability directory.

Do not show one flat unstructured list.

Group services around understandable tasks.

---

## File and manage taxes

- File Income Tax Return
- View Filed Returns
- e-Verify Return
- File Income Tax Forms
- View Filed Forms
- Download Pre-filled JSON
- e-Pay Tax

---

## View tax information

- Annual Information Statement (AIS)
- Form 26AS
- Tax Credit Mismatch

---

## Correct something

- Rectification
- Challan Correction
- Refund Reissue
- Condonation Request

Rectification will become deeply functional for the hackathon scenario.

---

## Respond to Income Tax

- Response to Outstanding Demand
- Worklist
- e-Proceedings
- Compliance Portal
- Reporting Portal

Response to Outstanding Demand will become deeply functional.

---

## People and permissions

- My Chartered Accountant
- My e-Return Intermediary
- Register as Representative Assessee
- Act on behalf of another person
- Authorise another person to act on behalf of self

---

## Account and verification

- Generate EVC
- View / Download e-PAN
- Aadhaar-related exemptions where relevant
- ITDREIN-related services where relevant

---

## Support and grievances

- Submit Grievance
- View Grievance Status
- Help
- FAQs
- User manuals

---

# Conventional Experience vs Intelligent Experience

The conventional redesign should remain clearer than the current portal.

However, it should not perform the AI-assisted diagnosis automatically.

The user may separately inspect:

Return

→ Payment

→ Form 26AS

→ Outstanding Demand

These records may appear inconsistent.

The normal service does not automatically tell the citizen why.

---

# Assisted Experience

When the citizen requests help from the Outstanding Demand:

Return

+

Payment

+

Form 26AS

+

Processing result

+

Outstanding Demand

→ deterministic reconciliation

→ evidence packet

→ plain-language diagnosis

→ corrective workflow

The key product improvement is therefore not access to new government data.

It is the ability to understand and orchestrate existing government information around the citizen's problem.

---

# Core Scenario Depth

Only these capabilities require deep functional implementation for the hackathon:

1. View Outstanding Demand
2. Conventional Response to Outstanding Demand
3. Inspect relevant Return
4. Inspect relevant Payment
5. Inspect relevant Form 26AS data
6. Tax Credit Rectification
7. AI-assisted diagnosis
8. AI-assisted orchestration of Rectification + Demand Response
9. Combined case tracking

Everything else exists primarily to demonstrate credible service coverage.

---

# Rule for Future Implementation

Before removing, renaming or restructuring an Income Tax capability:

1. Check this parity map.
2. Confirm that the underlying capability remains discoverable.
3. Prefer clearer citizen-oriented organisation over copying current portal navigation.
4. Do not deeply implement unrelated capabilities simply for visual completeness.
5. If a current service is intentionally omitted, document the reason.

---

# Success Criterion

A judge should be able to look at the prototype and conclude:

> The redesign has not removed the Income Tax portal's important capabilities. It has reorganised them so that citizens can find and understand them more easily.

At the same time, the engineering effort remains focused on one deeply implemented end-to-end problem.