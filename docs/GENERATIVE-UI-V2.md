# Generative UI V2

## Purpose and migration status

This document defines the target structured composition contract for the Assistance Workspace. It is conceptual documentation; current TypeScript schemas and renderers have not been migrated.

The V2 contract preserves the existing Evidence Packet, deterministic diagnosis and workflow mapping, MockAssistanceEngine/provider abstraction, Zod trust boundary, trusted rendering, explicit consequence gates and conventional fallback.

## Core rule

The model selects a useful approved representation of verified context. It does not generate a webpage or authoritative government facts.

Prohibited output includes arbitrary HTML, React, JavaScript, CSS, URLs, animation instructions, government statuses, financial calculations, workflows and executable actions.

## Representation grammar

Representations describe how information should be understood. They are not nine generic rectangular cards.

### Attention

Purpose: identify what genuinely requires the citizen's attention.

### DeadlineCalendar

Purpose: show when the citizen needs to care. Dates and whether they apply are deterministic.

### Comparison

Purpose: reveal differences between verified records.

### Explanation

Purpose: state what a verified condition means in plain language.

### SourceTrace

Purpose: show why the explanation is supported and which records were used.

### Checklist

Purpose: show whether deterministic prerequisites and evidence are available.

### Decision

Purpose: present a genuine choice that must remain with the citizen.

### ActionPlan

Purpose: explain an approved workflow sequence in outcome-first language.

### Timeline

Purpose: show what has happened, what is happening now and what remains pending.

## Surface types

Surface types constrain composition intent:

- `home`: Attention + DeadlineCalendar;
- `understanding`: Comparison + Explanation + SourceTrace;
- `decision`: Decision;
- `action`: Checklist + ActionPlan;
- `review`: mostly deterministic structured review UI;
- `status`: Timeline + Explanation.

A surface is a workspace state specification, not a route and not a free-form canvas.

## Field categories

### `dataRef`

A validated reference to deterministic application data, for example `evidence.payment.amount`. The Data Binding Resolver supplies the value; the model does not restate or calculate it.

### `copy`

Human-facing supporting language that may be generated or selected by the model. Copy cannot override the meaning of bound facts, official status or workflow state.

### `enum`

A controlled choice such as representation type, approved variant, surface type or layout. Unknown enum values fail validation.

### `actionId`

An identifier from the Approved Action Registry, such as `review_rectification`. An action is available only when deterministic application state permits it.

## Allowed layout vocabulary

The model may select only:

- `stack`;
- `split`;
- `hero-detail`;
- `compact-grid`;
- `progressive`.

These enums map to application-owned layouts. The model may not provide widths, positions, breakpoints, CSS values, class names or animation instructions.

## Authority boundaries

### LLM controls

- interpretation of natural-language intent;
- supporting plain-language copy;
- selection of the most useful approved representation;
- approved layout variants;
- prioritisation of verified evidence;
- progressive disclosure;
- ordering of informational sections within permitted bounds;
- suggested labels for approved actions.

### Deterministic software controls

- every monetary value and calculation;
- Assessment Year;
- payment and official statuses;
- deadlines and whether they apply;
- whether an item genuinely requires attention;
- record relationships;
- diagnosis;
- valid workflows and action ordering;
- prerequisites and validation;
- submission and case state;
- synthetic submission references;
- `dataRef` resolution and `actionId` availability.

### Citizen controls

- consent to use assistance;
- whether retrieved records appear correct;
- meaningful choices and declarations;
- final confirmation;
- submissions and payments.

## Composition pipeline

```text
Citizen intent + portal context
              ↓
Deterministic reconciliation and Evidence Packet
              ↓
Approved representations + layouts + actions
              ↓
Assistance Engine
              ↓
Surface Specification
              ↓
Zod validation
              ↓
Trusted Representation Registry
              ↓
Data Binding Resolver + Approved Action Registry
              ↓
Rendered Assistance Workspace
```

Validation failure stops the V2 composition. Unknown representations, bindings or actions are not partially rendered or executed; the normal portal remains available.

## Conceptual structured output

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

The example intentionally references authoritative values rather than hard-coding ₹18,420 or ₹0 in model output.

## Income Tax example compositions

### Assistance Home

Surface `home`, layout `stack`: Attention foregrounds the Outstanding Demand only because deterministic software marks it as requiring attention. DeadlineCalendar shows only verified applicable dates.

### Demand understanding

Surface `understanding`, layout `hero-detail`: Comparison binds payment, processed-return and difference values. Explanation describes the deterministic `payment_missing_from_processed_return` diagnosis. SourceTrace begins collapsed.

### Corrective action

Surface `action`, layout `progressive`: Checklist binds the available payment and Form 26AS evidence. ActionPlan binds the approved Rectification then Demand Response sequence.

### Consequence review

Surface `review`: the model may supply restrained explanatory copy, but application-owned structured UI fixes authoritative values, required evidence, declaration, submission warning and confirmation action.

### Case tracking

Surface `status`, layout `stack`: Timeline binds persistent case state and stable synthetic references. Explanation tells the citizen that nothing is required while the case is `WAITING_FOR_REVIEW`.

## Approved Action Registry boundary

The registry owns the mapping from `actionId` to application behaviour, label constraints, prerequisites and consequence level. A model-provided action is a request to present an already-approved capability, never authority to execute it.

Consequential actions must remain unavailable until deterministic prerequisites pass and must require an explicit citizen interaction at the rigid review boundary.

## Progressive rigidity

Understanding surfaces can adapt their representation and disclosure. Action surfaces can explain only approved workflow sequences. Review surfaces restrict composition. Submission and state transitions are entirely deterministic and citizen-triggered.

The closer the citizen gets to a legal or financial consequence, the less control the model has over presentation and behaviour.
