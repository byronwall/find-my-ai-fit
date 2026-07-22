# Opportunity Backlog

This document preserves ideas from the dictation that should not be allowed to expand the first live site. Items are grouped into product opportunities rather than presented as one undifferentiated feature backlog.

## Horizon 1 — Extensions to the AI Use Case Grid

These build directly on the first product and can be tested after the core flow works.

### Better context and intent

- Add editable company, industry, team, and tool context.
- Safely enrich public company context without scraping LinkedIn.
- Let the user shift from current role to next role, job search, nonprofit work, learning, hobbies, or another life area.
- Ask adaptive, high-information questions rather than a fixed onboarding interview.
- Maintain a user-visible profile of facts, goals, and inferred interests.

### Richer exploration

- Generate additional ideas for a row, column, or cell.
- Offer “more like this,” “take this in another direction,” and typed combination actions.
- Hide an irrelevant row or column.
- Swap to a different pair of axes such as feasibility × time horizon.
- Recommend a cell based on the user’s selections and explain the recommendation.
- Support recursive child grids when each level adds a genuinely new distinction.

### Persistence and collaboration

- Save sessions and return later.
- Share a read-only grid or selected subset.
- Compare two grids, such as current role and desired future role.
- Add notes to a complete suggestion, while avoiding sentence-level editing complexity.
- Export the grid and synthesis as Markdown, PDF, or a structured handoff.

### Downstream execution

- Generate a tailored prompt for ChatGPT, Claude, Codex, or another tool.
- Produce a rough plan, workflow diagram, experiment, policy outline, or implementation brief based on the chosen use case.
- Open a new agent task with the selected context.
- Inspect a relevant codebase and perform a planning gap analysis before implementation.
- Route high-complexity ideas into a consulting assessment.

## Horizon 2 — LinkedIn Profile Toolkit

The same profile input can power several focused tools, but these should be separate entry points with distinct promises:

### Profile critique

Evaluate whether experience bullets are clear, specific, outcome-oriented, and credible.

### Goal-directed rewrite

Rewrite a profile toward a target role, industry, consulting offer, or other declared objective.

### Learning opportunity map

Identify adjacent skills, missing knowledge, and practical learning projects based on experience and future direction.

### Career and contribution explorer

Suggest future roles, job-search directions, nonprofit intersections, or ways to use existing expertise outside the current job.

These products share extraction infrastructure, not necessarily the grid or the same customer funnel.

## Horizon 2 — General Brainstorming Workspace

A broader product can make AI brainstorming easier and more structured for topics unrelated to professional profiles.

Potential capabilities:

- Start with known input fields instead of asking predictable questions in chat.
- Accept an existing document as the initial context.
- Generate compact, categorized ideas rather than a prose answer.
- Let the user narrow using selections, filters, row/column focus, and adaptive questions.
- Shift the requested output among strategy, practical steps, questions, considerations, and preferences.
- Synthesize selected ideas into a user-interest profile and final report.
- Explicitly transition from exploration to artifact creation.

The key product question is whether a stable set of common brainstorming dimensions exists or whether every topic demands new axes.

## Horizon 3 — Personal Spatial Organizer

The dictation describes a lightweight organizer in which tasks, suggestions, ideas, tips, drafts, and notes live in nested visual drawers.

User promise:

> Stay only two or three taps away from a narrow, relevant set of things without carrying the rest in your working memory.

Possible product characteristics:

- Phone-first or native iOS interaction
- 3 × 2, 3 × 3, or 4 × 4 spatial home views
- Tap to focus; zoom out to set an area aside
- Progressive rendering from dot, to title, to summary, to full content
- “Store for later” without treating every item as an active task
- AI-suggested partitions based on the variables that matter within an area

This is closer to personal information management than to the hosted lead-generation site and should be evaluated as a separate product.

## Horizon 3 — Transcript and Large-Context Explorer

The original dictation itself illustrates this problem: a long transcript contains ideas, possible work, decisions, questions, and observations that are hard to reduce to a flat task list.

Potential workflow:

1. Chunk a transcript or document into findings.
2. Summarize each finding and preserve source spans.
3. Tag findings on two meaningful dimensions, such as type × urgency.
4. Render the findings as a grid with counts and compact summaries.
5. Focus a cell and optionally repartition it using local axes.
6. Generate an exact plan, report, or task set only for the focused subset.

Possible axis sets include:

- Task / decision / idea / question × now / soon / later
- Could / should / must × product area
- Topic × chronology
- Evidence type × confidence
- Workstream × implementation readiness

This could evolve toward a hierarchical pivot-table experience in which rows and columns themselves contain grouped variables.

## Shared platform possibilities

Only extract shared infrastructure when at least two working products need it. Plausible shared pieces are:

- Source ingestion and chunk provenance
- Structured finding schema
- Taxonomy and axis definitions
- Classification and duplicate detection
- Grid, cell-focus, breadcrumb, and detail components
- Session-profile and selection state
- Prompt/brief export
- Evaluation tools for specificity, coverage, and relevance

Avoid starting with a universal ontology for tasks, ideas, transcripts, and documents. Their shared abstraction should emerge from shipped use.

## Business model and funnel options

The dictation leaves the product goal intentionally open. The main options are:

### Consulting lead generator

Bias suggestions toward problems the consultancy can credibly help implement, while still giving an ungated result. Qualify leads through selected use cases and requested next steps.

### Free tool with AI handoff

Give the user a high-quality prompt or brief for their existing AI system. This maximizes utility and reach but needs a separate revenue model.

### Guided execution product

Keep the user inside the system for a small set of repeatable outcomes. This only works if the guided workflow is materially better than a general chat tool.

### Personal paid workspace

Charge for saved profiles, recurring exploration, personal organization, integrations, and cross-session memory. This belongs to the broader organizer, not the first public generator.

## Research questions across the backlog

- Is the grid useful because it is two-dimensional, because it is compact, or because it provides explicit categories?
- Which clicks provide reliable intent signals rather than casual curiosity?
- How many ideas can users scan before the grid becomes noise?
- When does hierarchy create orientation, and when does it hide useful content?
- Can a model propose stable local axes across repeated sessions?
- What is the natural stopping signal for different kinds of brainstorming?
- Which execution artifacts do users actually use after generation?
- Does stored spatial location help people remember ideas over time?
- Are transcript findings better organized by semantic type, chronology, urgency, or user-defined workstream?

## Ideas explicitly parked

The following metaphors and mechanisms are preserved as inspiration, not commitments:

- Treemap-style click-to-isolate
- Quadtree or Barnes–Hut-like subdivision
- Telescope-style repeated zoom
- Stacked or 3D Z-index history
- Dots that reveal more content as the viewport gets closer
- Multi-variable grouped rows and columns resembling a pivot table
- Agent-spawned investigations and implementation threads

Each should be introduced only if it solves an observed usability problem more simply than a conventional grid, list, breadcrumb, or detail panel.

