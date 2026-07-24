# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are working professionals who are curious about AI but do not yet have a precise project in mind. They need help translating broad AI capability into opportunities grounded in the work they actually do, without needing prompting expertise. Experienced AI users may also use the product for a fast outside perspective.

The product also serves the portfolio owner by demonstrating product and AI implementation judgment and by creating qualified interest in consulting help after the user has received standalone value.

## Product Purpose

The product turns a LinkedIn profile PDF plus a short statement of intent into a structured, personalized map of practical AI use cases. A user can review what was understood, scan the opportunity space, inspect and select relevant ideas, explore one area more deeply, and leave with a concrete experiment, prompt, or next-step brief.

Success means the experience is genuinely useful as a standalone exploration tool while also functioning as a strong portfolio demonstration and an earned path to consulting leads. The lead path must follow delivered value rather than gate it.

## Positioning

Unlike a generic chat response or static prompt library, the product organizes personalized AI opportunities into a scannable two-dimensional grid, preserves the relationship between each suggestion and the user's supplied context, and progressively increases specificity as the user signals interest. It produces a portable handoff instead of trying to become the execution environment for every idea.

## Operating Context

Users may begin immediately with a complete HR business partner example or upload a LinkedIn profile PDF. A personalized session combines profile facts with an optional goal, time horizon, and free-text direction. Users review extracted facts and labeled inferences before generation, then move through a 3 × 3 opportunity grid, suggestion details, one focused cell, and a final brief.

The experience is intended for public web use and should remain useful for the owner's own experimentation. Results continue in the user's existing AI tool, implementation workflow, or an optional consulting conversation.

## Capabilities and Constraints

- Accept a LinkedIn profile PDF as the primary source of personal context; do not scrape LinkedIn profile URLs.
- Keep uploaded facts, user statements, external context, and model inferences distinguishable.
- Generate schema-validated, non-duplicative work use cases with a clear fit reason, expected benefit, feasibility, sensitivity note when relevant, and smallest next step.
- Organize the initial result across three individual-startable moments of work—prepare, deliver, and improve—and three kinds of value, with at most one deeper grid level in the MVP.
- Let users inspect, select, dismiss, save locally, and refine ideas without losing session context.
- Produce a synthesis, recommended starting point, smallest experiment, and ready-to-copy prompt or brief.
- Do not require contact information to receive a result. Consulting is an optional secondary handoff.
- Send a personalized PDF to the configured model provider only for the active request; do not persist the PDF or extracted profile. Saved ideas currently remain in the browser on the user's device.
- Keep the public personalized experience economical through compact inputs, structured outputs, progressive disclosure, and appropriate model selection.
- The MVP is not a general chatbot, profile-writing product, knowledge-management system, native app, CRM, or automatic implementation environment.

## Brand Commitments

The working name is “AI Use Case Grid,” but the name is explicitly open to improvement. There is no confirmed requirement to preserve the incumbent palette or visual identity. The product voice should remain practical, specific, candid about inference, and careful with personal or sensitive work context.

## Evidence on Hand

- The runnable SolidStart application in `app/` implements the example and personalized flows.
- `ai-use-case-grid/01-jobs-to-be-done.md` records the primary user, business, and system jobs derived from the original concept.
- `ai-use-case-grid/02-live-site-mvp.md` defines the MVP promise, workflow, privacy requirements, non-goals, and initial success hypotheses.
- `ai-use-case-grid/05-real-example-content.md` and `app/src/features/use-case-grid/example-data.ts` provide a realistic HR business partner example.
- `docs/jobs-to-be-done-verification.md` maps intended jobs to implementation evidence.
- Initial quantitative targets in the MVP brief are hypotheses, not validated benchmarks. There are no confirmed testimonials, customer logos, case studies, or performance claims; future work must not fabricate them.

## Product Principles

1. Deliver useful value before asking for contact or consulting interest.
2. Make AI opportunities specific to real work rather than describing generic capabilities.
3. Organize breadth for fast scanning, then reveal depth only after the user signals intent.
4. Keep the user in control of facts, inferences, selections, and the next step.
5. End exploration with a portable, appropriately scoped action rather than an oversized artifact.
