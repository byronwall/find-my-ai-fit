# Live Site MVP: Personalized AI Use Case Grid

## Product promise

Upload your LinkedIn profile, add one sentence about what you want, and receive a structured map of AI use cases tailored to your work. Select the useful ideas, explore one area more deeply, and leave with a concrete prompt or next-step brief.

## Target user and moment

The first user is a professional who is AI-curious but does not already have a precise project in mind. They know generic advice exists. Their problem is translating broad AI capability into something relevant to the work they actually perform.

The product should also work for an experienced AI user who wants a fast outside perspective, but it should not require prompting expertise.

## The first live example

Before profile upload is wired to a model, ship one realistic, precomputed path that exercises the complete interface.

Suggested example persona:

- Role: HR business partner
- Environment: automotive manufacturer
- Context: hourly workforce, union environment, manager support, recurring employee-relations questions
- Intent: improve the current role in the next 30 days

This example is useful because company and industry context visibly changes the result. The grid should contain specific work such as grievance-theme analysis, manager conversation preparation, policy-question routing, workforce communication drafting, and negotiation scenario synthesis—not generic entries such as “write emails faster.”

The public page should offer both routes:

1. **Try the example** — immediate, no upload, full interaction.
2. **Use my profile** — upload a LinkedIn PDF and generate a personal grid.

The example is not a separate mockup. It uses the same data contract and components as a generated result.

## Core flow

### 1. Landing

Explain the outcome, show a small preview of the grid, and make “Try the example” and “Upload LinkedIn PDF” the dominant actions. Include a short privacy statement next to upload.

### 2. Context intake

Required:

- LinkedIn profile PDF

Optional but prominent:

- Goal: improve my current role, prepare for another role, job search, learn, or other
- Time horizon: this week, this quarter, or explore longer term
- Free text: “What are you hoping AI could help with?”

Do not require contact information to generate a result. After extraction, show a compact “What we understood” summary with an edit or correction path.

### 3. Initial grid

Render nine cells using these axes:

| | Do work faster | Make better decisions | Create a new capability |
|---|---|---|---|
| **Recurring individual work** | 2–3 suggestions | 2–3 suggestions | 2–3 suggestions |
| **Team and collaboration** | 2–3 suggestions | 2–3 suggestions | 2–3 suggestions |
| **Customers, partners, or organization** | 2–3 suggestions | 2–3 suggestions | 2–3 suggestions |

The row labels can be adapted to the profile while preserving the semantic levels. For an individual contributor, “team and collaboration” still works; for a consultant, the bottom row may render as “clients and market.”

Each collapsed suggestion shows:

- Title
- One-sentence description
- Feasibility badge: **use now**, **configure**, or **build**

Each cell shows at most three suggestions in the overview. The design should optimize scanning rather than equal cell height at all costs.

### 4. Inspect and select

Opening a suggestion reveals:

- The work problem it addresses
- Why it fits the supplied context
- Expected benefit
- Inputs or systems it needs
- Risk or sensitivity note
- A smallest next step

The user can mark it **Interesting**, dismiss it, or choose **Explore this area**. Selection is reversible and visible in the grid.

### 5. Refine one cell

“Explore this area” replaces the overview with a focused view of that cell. It may ask one question only if the answer will meaningfully change the ideas. It then generates or reveals five to eight narrower suggestions.

This is one level of zoom for the MVP. A breadcrumb returns to the full grid and preserves selections. Recursive grids are deferred.

### 6. Finish and hand off

Once at least one item is selected, make **Build my next-step brief** available. The result includes:

- Selected use cases
- A two- or three-sentence synthesis of the user’s apparent priorities
- One recommended starting use case with a reason
- The smallest experiment to run
- A ready-to-copy prompt for the user’s AI assistant
- Optional secondary CTA: discuss implementation with a consultant

Let the user copy the prompt and download or print the brief. Email capture can be offered for delivery, but it is not a gate.

## Functional requirements

### Required for the static example release

- Responsive landing and intake states
- Example persona and precomputed result
- 3 × 3 grid with compact cards
- Suggestion detail view
- Interesting/dismiss actions
- One-level cell focus with breadcrumbs
- Final synthesis and copyable prompt
- Local session state so navigation does not erase choices
- Basic event instrumentation

### Required for personalized generation

- PDF upload and text extraction
- File validation and actionable extraction errors
- Extracted-profile review/correction
- Structured generation with schema validation
- Duplicate and generic-idea filtering
- Loading, partial-failure, retry, and safe-fallback states
- Clear retention/deletion policy
- Server-side secrets and abuse/rate controls

## Suggested structured data contract

```ts
type UseCaseSession = {
  id: string
  source: "example" | "profile-upload"
  profile: {
    summary: string
    roles: string[]
    industries: string[]
    skills: string[]
    organizations: string[]
    userCorrections: string[]
  }
  intent: {
    goal?: string
    timeHorizon?: "week" | "quarter" | "longer-term"
    notes?: string
  }
  grid: Grid
  selectedUseCaseIds: string[]
  dismissedUseCaseIds: string[]
}

type Grid = {
  id: string
  title: string
  parentCellId?: string
  rowAxis: Axis
  columnAxis: Axis
  cells: Cell[]
}

type Axis = {
  label: string
  values: Array<{ id: string; label: string; description: string }>
}

type Cell = {
  id: string
  rowValueId: string
  columnValueId: string
  summary: string
  useCases: UseCase[]
  childGrid?: Grid
}

type UseCase = {
  id: string
  title: string
  summary: string
  problem: string
  fitReason: string
  expectedBenefit: string
  requiredInputs: string[]
  sensitivityNote?: string
  firstStep: string
  feasibility: "use-now" | "configure" | "build"
  specificity: "broad" | "focused" | "actionable"
}
```

The UI should render only validated structured records. Model prose should not directly determine layout.

## Content and generation rules

- Prefer work tasks and decisions over broad capabilities.
- Tie every suggestion to at least one supplied fact or declared goal.
- State fit as a reason, not as certainty about the person.
- Avoid near-duplicates across cells.
- Spread the initial result across the grid, but do not fabricate weak ideas just to fill every cell.
- Include a mix of immediately usable, configurable, and build-worthy ideas.
- Flag use cases involving employee, health, legal, financial, or other sensitive data.
- Keep the first view short. Detail is generated or shown only after user intent.

## Analytics and success criteria

Track anonymous or pseudonymous events for:

- Example started
- Upload started/completed/failed
- Grid generated
- Suggestion opened, selected, or dismissed
- Cell focused
- Brief generated
- Prompt copied
- Consultation CTA opened/submitted

Initial product signals:

- At least 60% of completed grids produce one or more selected ideas.
- At least 30% produce a prompt copy or brief download.
- Median time from result display to first selection is under two minutes.
- Users can correctly explain what the rows and columns mean in lightweight usability testing.
- Fewer than 20% of tested suggestions are rated “generic” or “not connected to my work.”

These are starting hypotheses, not established benchmarks.

## Privacy and trust requirements

- Tell users before upload what is extracted, whether a model provider receives it, and how long it is retained.
- Do not require the PDF to persist after extraction unless the user explicitly saves a session.
- Provide a delete action for saved sessions.
- Never imply access to private employer systems from a LinkedIn profile.
- Label external company context and model inference separately from uploaded facts.
- Avoid LinkedIn URL scraping in the first release.

## Explicit non-goals for the MVP

- A general ChatGPT replacement
- Infinite chat about the generated ideas
- Arbitrary user-defined axes
- More than one level of grid refinement
- A 3D, quadtree, or animated spatial visualization
- Multi-document knowledge management
- Cross-session personal task organization
- Native iOS application
- Automatic codebase investigation or task spawning
- Profile critique, rewriting, or learning-path products
- Full consulting intake or CRM implementation

## Delivery milestones

### Milestone 1 — Real example on a live URL

The HR business partner example completes the entire flow with precomputed content. It is responsive, understandable, and instrumented.

### Milestone 2 — Personal input

Users upload a LinkedIn PDF, correct the extracted summary, and receive a schema-valid personal grid.

### Milestone 3 — Intent refinement

Users focus one cell, receive narrower suggestions, and generate a final next-step brief.

### Milestone 4 — Funnel experiment

Test copy, optional contact capture, and consulting CTA placement without reducing the ungated value of the tool.

## Open product questions to test, not debate indefinitely

- Do users understand the proposed axes, or do categories like **automate / augment / create** work better?
- Is one optional goal field enough to prevent current-role overfitting?
- Do users prefer opening suggestions in-place, in a side panel, or on a dedicated page?
- Does one cell refinement materially improve the chosen idea?
- Is the best handoff a prompt, a short plan, or a downloadable report?
- Will users upload a LinkedIn PDF before seeing value, or must the example establish trust first?

