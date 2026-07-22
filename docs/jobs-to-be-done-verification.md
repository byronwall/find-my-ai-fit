# Jobs-to-be-done coverage and verification

This document maps the unique jobs captured from the dictation to the live implementation. The source inventory remains [`ai-use-case-grid/01-jobs-to-be-done.md`](../ai-use-case-grid/01-jobs-to-be-done.md); preserving that inventory separately keeps future product ideas from being mistaken for current MVP promises.

Status meanings:

- **Verified** — implemented and exercised through the running UI or automated tests.
- **Implemented** — present in the product and covered by structural/build verification.
- **Preserved for later** — intentionally outside this release and retained in the backlog.

## Primary user jobs

| Job | Status | Implementation and evidence |
| --- | --- | --- |
| J01 — supply context with almost no setup | Verified | PDF dropzone accepts one PDF up to 10 MB. The real four-page `BYRON-WALL-LINKEDIN-RESUME.pdf` completed the UI flow. |
| J02 — add intent the profile cannot reveal | Verified | Optional goal, time horizon, and free-text direction appear after upload and are passed to generation. Free-text direction was exercised with the real resume. |
| J03 — receive ideas reflecting the actual situation | Verified | The real resume produced engineering-specific ideas such as local implementation planning, time-series critique, and architecture trade-off memos. |
| J04 — see the whole opportunity space | Verified | Desktop renders a two-dimensional 3×3 matrix; mobile renders the same hierarchy as row sections with column tabs. The real result showed 18 ideas across nine visible cells. |
| J05 — understand enough to judge each idea | Verified | Cards expose title, compact task summary, and feasibility; selection opens problem, fit, benefit, first step, provenance, and safety detail. |
| J06 — signal relevance with low friction | Verified | Users can select, save, dismiss, restore dismissed ideas, open details, choose a refinement direction, and move into a focused cell. Saved state survived reload during browser verification. |
| J07 — explore a promising region | Verified | “Explore this area” opens a focused view with row/column breadcrumb, narrower ideas, and a route back to the full grid. |
| J08 — ask for more ideas in a chosen direction | Verified | “Generate more here” requests a fresh strict-schema batch for the active cell and includes the selected refinement direction. The example also has a deterministic additional-ideas state. |
| J09 — move to a concrete next action | Verified | Every use case contains a smallest experiment. Selected ideas produce a recommended starting point and bounded experiment. |
| J10 — finish with a coherent takeaway | Verified | The live brief synthesizes the selected theme, recommends one selected use case, explains why, and preserves the selections. |
| J11 — carry the result forward | Verified | The brief supports prompt copy, a downloadable Markdown data link, and an email handoff containing the generated prompt. |
| J12 — set aside useful ideas | Verified | Save/unsave is available on cards and details; at most 30 ideas are stored in device-local `localStorage`. No profile data is stored there. |

## Product and business jobs

| Job | Status | Implementation and evidence |
| --- | --- | --- |
| B01 — demonstrate value before lead capture | Implemented | The complete grid and brief are ungated. The only service CTA appears after the portable result is complete. |
| B02 — keep the experience economical | Implemented | One compact PDF request produces strict structured output with `gpt-5.6-terra`, low reasoning effort, low text verbosity, and two ideas per cell. Focus and brief are deferred until explicit intent. |
| B03 — learn which demand resonates | Implemented | The privacy-preserving event endpoint records example start, generation outcome, idea open/select/save/dismiss, cell focus, more generation, brief completion, copy, download, and handoff. It does not receive raw profile text. |
| B04 — reuse the interaction pattern | Implemented | Rows, columns, records, grouping, focused output, briefs, and example data are separate typed domain modules rather than hard-coded page markup. Broader applications remain documented in the opportunity backlog. |

## System jobs

| Job | Status | Implementation and evidence |
| --- | --- | --- |
| S01 — extract and normalize context | Verified | OpenAI receives the PDF as a file input; strict `profileSchema` normalizes summary, roles, industries, skills, organizations, facts, and inferences. The profile-review screen was exercised with the real resume. |
| S02 — distinguish facts, statements, and inference | Verified | Profile facts and cautious inferences have separate UI panels. Every use case includes one to four provenance records with source and detail. |
| S03 — generate structured suggestion records | Verified | Zod requires stable ID, title, summary, problem, fit reason, benefit, inputs, sensitivity, first step, feasibility, specificity, grid location, and provenance. |
| S04 — use stable dimensions and classification | Verified | The schema accepts only three stable rows and columns. Generation requires exactly 18 records; tests assert two records per cell for the shipped example. |
| S05 — maintain an evolving session profile | Verified | The client store retains profile, declared intent, selections, dismissals, focused cell, refinement answer, generated focus batch, and brief. Only saved ideas persist across sessions. |
| S06 — ask high-information questions | Verified | The broad grid asks no generic follow-up. A focused cell asks one contextual refinement question with two to four compact choices. |
| S07 — increase specificity with intent | Verified | Scan cards are compact, focused ideas are narrower, detail appears on selection, and the long execution prompt is created only after explicit brief selection. |
| S08 — synthesize without erasing choices | Verified | The brief lists every selected idea and recommends an ID constrained to that selected set. “Back to my grid” returns to the exploration state. |
| S09 — produce a portable handoff | Verified | Strict `briefSchema` produces theme, selected recommendation, rationale, experiment, and a constrained ready-to-use prompt; copy, Markdown, and email paths are exposed. |
| S10 — handle personal documents responsibly | Verified | The landing page states transmission and non-retention before upload. Responses use `store: false`; raw PDFs/profile text are not logged or persisted; the selected file reference is cleared after generation. |

## Preserved adjacent jobs

All transcript ideas outside the first product remain documented in [`ai-use-case-grid/04-opportunity-backlog.md`](../ai-use-case-grid/04-opportunity-backlog.md), including profile rewriting, learning plans, arbitrary-topic brainstorming, spatial personal organization, document decomposition, transcript processing, multidimensional context navigation, and codebase gap analysis. They are **preserved for later**, not silently dropped or partially represented as current features.

## Verification record

- Automated: `pnpm -C app test`, `pnpm -C app type-check`, and `pnpm -C app lint` pass.
- Live OpenAI: the focus endpoint returned six strict-schema ideas; the real resume endpoint completed successfully and rendered 18 ideas across all nine cells; a live two-selection brief completed successfully.
- Browser: desktop landing, real profile review, full grid, detail inspector, focused cell, and live brief were exercised; mobile landing, row tabs, cards, fixed detail panel, and brief were exercised at 390×844.
- Privacy: the ignored `app/.env` contains the local key, no key was printed, and server logs contain only event names, IDs/counts, outcome, and elapsed time.
- Visual evidence and the scored usability report live under `tmp/evals/` because they are run artifacts rather than source documentation.
