# Design QA — Generative Civic Dashboard

## Comparison target

- Selected source: `design-references/generative-civic-home-v2.webp` (1487 × 1058 px).
- Browser implementation: authenticated `/dashboard`, captured at 1363 × 936 CSS px.
- State: portal home with generated task cards and the open-ended service prompt.

## Comparison findings

- The simplified upper composition matches the selected direction: one compact product header, one outcome prompt, one supporting line, and three examples. The removed greeting and decorative skyline no longer compete with the prompt.
- The four-card row preserves the requested department and urgency labels while keeping each task's hierarchy consistent.
- Generated illustrations use the selected soft lilac/green editorial style and occupy a fixed 118 px visual slot without cropping or stretching.
- The final empty-state card uses a calm `Available anytime` label and points people back toward either browsing or describing a need.
- At the desktop QA viewport, the page has no horizontal overflow and the full dashboard fits within a single, readable composition.

## Comparison history

### Iteration 1

- P1: generated card illustrations were invisible through the framework image optimizer.
- Fix: served the purpose-built WebP assets directly through the image component's unoptimized path.
- Post-fix evidence: all four illustrations render at their intended size and alignment.

- P1: the empty-state card's heading and illustration occupied the same visual row.
- Fix: restored the shared six-row card structure with a quiet `Available anytime` state.
- Post-fix evidence: department, state, illustration, heading, description, and action now follow the same vertical rhythm as the other cards.

- P2: the primary CTA and prompt examples relied entirely on client hydration.
- Fix: added native link/form destinations to the guided workspace while preserving the enhanced client transition.
- Post-fix evidence: the workspace route is statically generated and the production build includes `/pending-actions/demand/workspace`.

## Verification

- Lint: passed.
- Automated tests: 67/67 passed.
- Production build: passed, including the guided-workspace route.
- Desktop layout: passed at 1363 × 936 with no horizontal overflow.

final result: passed
