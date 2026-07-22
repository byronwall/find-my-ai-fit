# Hierarchical Grid Interaction Model

## Purpose

The grid is a compact way to transform low-intent exploration into high-intent selection. It uses two visible dimensions to organize suggestions, then allows the user to isolate one intersection and reveal a finer space inside it.

It combines ideas from a matrix, treemap, pivot table, faceted search, and semantic zoom. The distinctive behavior is not the initial 3 × 3 layout; it is that a cell can become the next working surface while preserving its place in the larger map.

## Core model

### Findings

The atomic item is a **finding**. In the first product, a finding is an AI use case. In other applications it could be a task, note, transcript insight, document chunk, question, or recommendation.

Every finding has:

- A stable identity
- A compact representation
- Expandable detail
- Attributes used for classification
- Provenance
- User state such as selected, dismissed, or saved

### Axes

An axis is a meaningful partition of findings. Examples from the dictation include:

- Area of life × time horizon
- Work area × type of value
- Urgency × impact
- Could / should / must × category
- Type × time
- Strategy / practical steps / questions × topic

Good axes have a small number of distinct, understandable values and help the user make a choice. A taxonomy that classifies accurately but does not affect a decision is not a useful visible axis.

### Cells

A cell represents the intersection of one row value and one column value. It contains zero or more findings and may hold a child grid. A cell needs a label or summary that remains meaningful after its original cards are collapsed.

### Session profile

The system accumulates a small profile from explicit context and behavior:

- Source facts
- Stated goal and constraints
- Selected findings
- Dismissed findings or regions
- Focused path through the hierarchy
- Answers to refinement questions

Clicks are intent signals, but they are not irreversible declarations. The user must be able to inspect and revise what the system inferred.

## Levels of disclosure

### Level 0 — Map

Show all row and column labels, cell density, and a few compact findings. The user is answering, “Where might something interesting be?”

### Level 1 — Cell

Isolate one intersection and list its findings with more text. The user is answering, “Is this area worth pursuing?”

### Level 2 — Refined grid

Split the focused cell using two locally useful dimensions. The user is answering, “Which specific direction inside this area fits?”

### Level 3 — Finding

Show the complete finding, rationale, dependencies, risks, and next action. The user is answering, “Should I act on this?”

### Level 4 — Artifact

After explicit opt-in, expand the finding into a plan, prompt, report, policy, diagram, or implementation brief. At this point the experience has left brainstorming and entered execution.

The first live site implements Levels 0, 1, 3, and 4, with a single constrained version of Level 2. It does not implement indefinite recursive subdivision.

## Interaction rules

1. **Overview before depth.** Do not render every description and level simultaneously.
2. **Stable geography.** Findings should not jump between cells without an explained reclassification.
3. **Visible path.** Breadcrumbs identify every parent cell and allow a one-step return.
4. **Preserved state.** Zooming, filtering, or changing detail must not lose selections.
5. **Reversible signals.** Select, dismiss, save, and focus actions can be undone.
6. **Local generation.** “More” adds findings only to the selected region unless the user requests a new map.
7. **Explicit expansion.** Long artifacts require an affirmative action.
8. **Adaptive density.** Empty cells may remain empty; high-density cells should summarize rather than overflow.
9. **Accessible alternatives.** The hierarchy must also work as a keyboard-navigable grouped list; meaning cannot depend on color or spatial position alone.
10. **Mobile continuity.** On narrow screens, preserve the row/column meaning through labels and focus navigation rather than shrinking nine unreadable cells.

## Choosing a child grid

When a cell is refined, the new axes should explain meaningful variation inside that cell. They do not need to match the parent axes.

A child grid proposal should pass four tests:

1. Each axis can be explained in one short phrase.
2. Categories are mutually understandable even if not mathematically exclusive.
3. Moving from one value to another changes the kind of decision or action available.
4. The resulting cells contain materially different findings rather than paraphrases.

If no pair passes these tests, use a ranked or grouped list instead of forcing a grid.

## Visual behavior

- Use compact cards or dots only when the labels and counts remain interpretable.
- Color may encode one stable attribute such as feasibility, but row and column position already carry two attributes.
- Show selection state more strongly than category decoration.
- Animate a cell opening only enough to preserve spatial continuity; do not turn zoom into spectacle.
- At overview scale, summarize hidden findings with count, theme, and selected count.
- At close scale, reveal prose and actions.

The telescope, treemap, quadtree, and stacked Z-index metaphors in the dictation are useful conceptual references. They are not literal rendering requirements.

## Generalization beyond AI use cases

The same model can organize other structured LLM output if it has findings plus attributes:

| Domain | Finding | Possible axes | Execution output |
|---|---|---|---|
| Brainstorming | Idea | topic × intent | brief or plan |
| Transcript review | Observation | type × urgency | task, decision, or report |
| Task organizer | Task or reminder | life area × time | focused task list |
| Document exploration | Chunk or claim | topic × evidence type | summary or analysis |
| Codebase planning | Gap or question | subsystem × readiness | implementation task |

Generalization should happen through a shared finding/grid data model after the first experience is proven, not through a universal UI configured in advance.

## Failure modes to watch

- **Grid theater:** attractive categorization that does not help a user choose.
- **Taxonomy churn:** axes or item positions change every turn and destroy spatial memory.
- **Forced completeness:** weak filler is generated to populate all nine cells.
- **False precision:** model-inferred categories look objective or exact.
- **Zoom without progress:** every child grid merely rephrases the parent.
- **No stopping condition:** the product rewards endless subdivision instead of action.
- **Premature expansion:** selecting an idea unexpectedly produces pages of detail or code.
- **Interaction overload:** every card exposes select, save, hide, combine, regenerate, annotate, and export at once.
- **Mobile collapse:** the desktop matrix becomes tiny, unlabeled cards on a phone.

## Validation questions

- Can a new user explain both axes after ten seconds?
- Can they identify one promising region without opening every card?
- Does focusing a cell produce narrower ideas, not just more ideas?
- Does the breadcrumb communicate where they are and how to return?
- Can they reach a useful next action in two or three decisions?
- Does a grouped-list rendering preserve the same conceptual model?

