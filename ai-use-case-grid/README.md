# AI Use Case Grid

This folder turns the ideas in [`brainstorming-tool-and-ai-use-case-generator-with-hierarchical-grid-ui.md`](../brainstorming-tool-and-ai-use-case-generator-with-hierarchical-grid-ui.md) into a focused product direction without discarding the broader concepts in the dictation.

## Product direction

Build a hosted experience that accepts a LinkedIn profile PDF, identifies personalized ways the person could use AI, and presents those ideas in a compact grid. The user can scan the full space, select promising ideas, zoom into one area, and leave with a useful next action.

The first release should prove one claim:

> A structured, personalized grid helps someone find a relevant AI use case faster than reading a generic list or working through an open-ended chat.

The hierarchical grid is an interaction pattern in service of that claim. It is not a reason to build a general-purpose information architecture platform before the AI-use-case experience works.

## Documents

- [`01-jobs-to-be-done.md`](01-jobs-to-be-done.md) is the deduplicated inventory of user, business, and system jobs found in the transcript.
- [`02-live-site-mvp.md`](02-live-site-mvp.md) defines the recommended first live product, including its flow, grid, data contract, boundaries, and acceptance criteria.
- [`03-hierarchical-grid-model.md`](03-hierarchical-grid-model.md) captures the reusable interaction model and the parts that should be deferred until the basic grid is validated.
- [`04-opportunity-backlog.md`](04-opportunity-backlog.md) preserves the other product ideas, downstream destinations, and adjacent applications.
- [`05-real-example-content.md`](05-real-example-content.md) supplies the complete HR business partner example for the first live UI fixture.
- [`mockups/README.md`](mockups/README.md) indexes four generated UI concepts covering the landing, desktop grid, focused detail, and mobile flow.

## Scope decisions made while processing the transcript

The dictation deliberately explores many branches and does not always choose among them. These decisions make the first implementation coherent:

1. The primary audience is an individual professional asking, “How could I use AI in work that actually resembles mine?”
2. The main input is a user-uploaded LinkedIn profile PDF. A few optional fields add intent and company context.
3. The first output is a fixed 3 × 3 grid, not an infinitely configurable pivot table.
4. The first two axes are **work area** and **kind of value**. They are understandable without teaching users the product’s taxonomy.
5. Selecting ideas and zooming into one cell are core. Arbitrary axis swapping, recursive zoom, mobile task organization, and transcript exploration are later opportunities.
6. The session ends with a synthesis and an actionable handoff. It does not become a general chat product.
7. The site may support consulting lead generation, but the generated result must be useful without submitting contact information or booking a call.

## Suggested build order

1. Build the experience with one realistic, precomputed example and no model dependency.
2. Add LinkedIn PDF upload, text extraction, and structured generation behind the same UI contract.
3. Add selection, one-level cell refinement, and final synthesis.
4. Measure whether people find relevant ideas and take a next action.
5. Only then test richer axes, recursive hierarchy, or the broader brainstorming system.
