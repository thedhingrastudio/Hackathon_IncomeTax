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

The interaction model is:

Intent

→ Context

→ Deterministic reconciliation

→ Diagnosis

→ Generated graphical interface

→ Citizen decision

→ Government workflow

→ Status

The guiding phrase is:

> Conversational intelligence, graphical interaction.

Natural language may help the citizen express their problem.

The primary user experience should not be a continuous chat conversation.

Once the system understands the case, information should be presented using appropriate graphical components such as:

- comparisons;
- status indicators;
- evidence;
- explanations;
- action plans;
- forms;
- confirmations;
- progress timelines.

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

AI assistance can be entered in two ways.

## Contextual assistance

From the Outstanding Demand page:

> Help me understand this

The system already understands which demand the citizen is viewing.

## Natural-language assistance

From the dashboard:

> Tell us what's happened...

Example:

> "I already paid this tax. Why does it say I owe ₹18,420?"

The system interprets the intent and opens the relevant case.

---

# AI Assistance Is Optional

The prototype includes an AI Assistance control.

When AI assistance is disabled:

- normal portal navigation continues to work;
- government records remain visible;
- forms remain usable;
- deterministic validation continues;
- AI-generated explanations and recommendations disappear.

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

Generative UI does not mean that the AI writes arbitrary webpages.

The system uses a trusted component catalogue.

The assistance layer produces structured UI instructions.

Those instructions are validated.

The application then renders approved components.

Initial component families include:

- notice;
- source check;
- amount comparison;
- diagnosis;
- evidence;
- action plan;
- review;
- timeline.

The composition may adapt to the user's situation.

The design system remains controlled.

---

# Design Direction

UX4G is the design-system foundation.

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