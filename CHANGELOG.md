# Changelog

This file records user-visible changes, important development workflow changes, and unresolved follow-ups. Detailed implementation retrospectives belong under `docs/` only when explicitly requested.

## Unreleased

- Replaced per-cell narrower-idea generation with one polished “Generate more ideas…” flow: each generated grid now includes two or three multiple-choice direction questions, an open feedback field guides a fresh replacement set, history arrows revisit earlier outputs, and selections from every set remain available in the final brief.

- Made the complete top-nav brand mark and name a keyboard-accessible home link that returns every workspace screen to `/`.

- Removed the redundant top-nav overflow menu and its Start over action.

- Reworked the final AI use case brief into a plan-first workspace with a task detail picker, per-task recommended starting points, removable selections with refreshed synthesis, and a readable prompt preview that preserves raw prompt copying.
  - Polished the brief with a stronger recommended-action anchor, high-contrast active task state, readable labeled prompt paragraphs, and clearer updating feedback.

- Simplified the opportunity grid into a checklist: each idea card now toggles “Interesting” directly, with save, dismiss, and detail actions removed from the grid workflow.
### Added

- Durable product context for design and implementation work, including the product's audience, standalone value, portfolio role, lead-generation purpose, privacy boundaries, and intentionally flexible name and visual identity.
- Durable UUID-keyed records for every live LLM attempt, including inputs, outputs, provider metadata, timing, and errors, plus admin list and detail pages for reopening generations.
- Personalized AI use-case generation from a LinkedIn PDF with an editable profile review, facts/inferences separation, and strict structured output.
- Responsive 3×3 opportunity grid with the complete HR example, compact cards, detail inspection, dismissal, device-local saving, selection, focused-cell refinement, and additional idea generation.
- Live OpenAI-backed focus and next-step brief endpoints using `gpt-5.6-terra`, low reasoning effort, strict schemas, and no provider-side response storage.
- Portable execution brief with a ready-to-use prompt, copy action, Markdown export, and implementation handoff.
- Privacy copy, anonymous interaction analytics, safety warnings, test coverage, OpenGraph metadata, and generated social-preview art.
- Product documentation capturing all transcript-derived jobs, MVP scope, grid behavior, adjacent opportunities, example content, and verification evidence.

### Changed

- Expanded the landing-page intake copy to welcome any resume PDF, not only LinkedIn profile exports.
- Documented and aligned the complete Docker Compose environment contract for OpenAI, deployment URLs, admin access, optional Resend email, and optional Stripe billing.
- Adopted the Find My AI Fit identity in the app header and page metadata, with the selected ink-and-periwinkle fit mark and matching SVG favicon.
- Split personalized generation into a quick profile-and-direction pass followed by an opt-in full grid, with a dedicated progress state and a user-selected direction guiding the heavier generation.
- Added a 100-character recommended-detail meter to the optional direction field while continuing to accept longer, valid context up to the existing 800-character limit.
- Reworked the profile-review step around an immediate broad-scan path plus nine equal-height, text-truncated optional priorities that support multi-select and Select all without obstructive hover cards, with a repeated Continue action directly beneath the choices.
- Moved profile editing to the bottom of the review step and restyled facts and cautious inferences as distinct informational evidence rather than clickable cards.
- Reframed the grid from individual/team/organization scope to individual-startable work moments: prepare and synthesize, deliver and communicate, and review and improve.
- Clarified focused exploration and the AI-generated final brief, including distinct self-serve and implementation-help next actions.
- Redacted uploaded PDF content from generation traces while retaining prompt, model, timing, normalized output, and failure observability.
- Redesigned the public use-case experience as a crisp strategy workspace with a stronger sans-serif type ladder, a cool periwinkle/citrus palette, more distinctive edges and depth, a profile-first intake, a full-width 3×3 mechanism preview, and progressive disclosure for secondary workspace actions.
- Compressed the opportunity grid's sticky header and moved persistent counts, saved/selection status, reset, restore, and brief actions into it so the matrix appears sooner and key actions remain available while scrolling.
- Simplified the landing-page grid preview into a narrower, more readable visual overview with stronger labels and no repeated supporting micro-copy.
- Hid the optional 100-character guidance once a profile PDF is attached so it does not imply that extra typing is required.
- Turned the full landing page into a PDF drop target with a bold branded drag overlay, global drop handling, and clear invalid-file recovery.

### Verification

- TypeScript, 10 domain/infrastructure tests, ESLint, production build, API smoke tests, and responsive browser evaluation completed; see `docs/jobs-to-be-done-verification.md` and `tmp/evals/ai-use-case-grid.md`.

### Follow-ups

- None currently.
