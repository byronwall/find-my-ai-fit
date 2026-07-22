# Jobs to Be Done

This inventory consolidates overlapping statements from the dictation into unique jobs. “Jobs” describe progress an actor wants to make; specific interface ideas from the transcript are listed as possible ways to serve those jobs, not as the job itself.

## Primary end-user jobs

### J01 — Supply useful context with almost no setup

**When** I want personalized ideas but do not want to explain my career from scratch,  
**I want to** provide information I already maintain,  
**so I can** get started with little or no typing.

Evidence and implications:

- Use a LinkedIn profile PDF as the reliable default; do not depend on scraping a profile URL.
- Make drag-and-drop sufficient to begin, with at most one explicit submit action.
- Avoid spending a model turn asking questions whose answers could have been form fields.
- Preserve the possibility of other source documents later.

Transcript: 3:14–6:57 and 10:44–12:20.

### J02 — Add the intent that a professional profile cannot reveal

**When** my profile describes where I have been but not where I want to go,  
**I want to** state the direction I care about,  
**so I can** prevent the suggestions from over-indexing on my current job.

Relevant intents include improving the current role, preparing for a future role, conducting a job search, finding nonprofit work, learning, exploring a hobby, or improving another part of life.

Transcript: 18:53–22:55.

### J03 — Receive ideas that reflect my actual situation

**When** I ask how AI might help me,  
**I want to** see use cases informed by my role, skills, industry, company, and current goals,  
**so I can** avoid generic suggestions that apply to everyone.

This creates an enrichment job for the product: combine uploaded facts with safe, current company or industry context when available, and distinguish known facts from inferences.

Transcript: 6:57–8:13.

### J04 — See the whole opportunity space at a glance

**When** I receive many suggestions,  
**I want to** scan a compact, organized view,  
**so I can** understand the range and distribution without reading a long chat response.

The transcript’s proposed solution is a grid with short titles, compact summaries, categories, colors, rows, and columns. Zero dimensions becomes a card list, one dimension becomes grouped cards, and two dimensions becomes a matrix.

Transcript: 12:36–15:11 and 24:46–25:40.

### J05 — Understand enough about each idea to judge it

**When** I scan a compact set of ideas,  
**I want to** understand the task, benefit, and rough shape of each one without opening every item,  
**so I can** decide which ideas deserve attention.

The smallest useful suggestion is a clear title plus one or two sentences. Extra detail should appear only on selection.

Transcript: 12:58–13:29, 16:17–17:18, and 40:20–41:37.

### J06 — Signal what is and is not relevant with low friction

**When** some suggestions resonate and others do not,  
**I want to** select, save, hide, or redirect ideas with a click,  
**so I can** teach the system what I mean without composing another prompt.

The useful unit of interaction is the complete suggestion, not sentence-level editing. Directional actions may include “more like this,” “take this in another direction,” or “combine with…”. A row or column can also be removed when an entire region is irrelevant.

Transcript: 15:15–18:20.

### J07 — Explore a promising region without being overwhelmed

**When** one category or intersection looks promising,  
**I want to** focus on it and reveal finer distinctions,  
**so I can** move from broad possibilities to high-intent, specific suggestions.

The proposed interaction is spatial zoom: a cell becomes a new grid, retains a breadcrumb back to the parent, and reveals more detail as the user moves closer. The user should not see every level of depth at once.

Transcript: 36:57–41:37 and 47:11–47:53.

### J08 — Ask for more ideas in the direction I choose

**When** an area is useful but sparse,  
**I want to** generate a small additional batch inside that area,  
**so I can** explore further without repopulating the entire experience.

The transcript considers five to ten new ideas per request, placed into the active row, column, or cell.

Transcript: 15:15–16:17.

### J09 — Move from inspiration to a concrete next action

**When** I find a promising use case,  
**I want to** know the smallest sensible next step,  
**so I can** act rather than leaving with a collection of interesting text.

The next output depends on the selected idea: a prompt, rough plan, diagram, policy outline, learning path, experiment, implementation brief, or consultation. The system should not prematurely generate code or a large document.

Transcript: 27:59–33:23 and 34:17–35:37.

### J10 — Finish the exploration with a coherent takeaway

**When** I have selected several ideas,  
**I want to** see their shared themes, what they imply about my priorities, and recommended next steps,  
**so I can** reach a meaningful stopping point instead of exploring forever.

The final result can include the grid, highlighted ideas, a short inferred-interest profile, a recommended cell, and practical next actions. The user should explicitly opt in before the product expands a thin idea into a long artifact.

Transcript: 27:59–32:28 and 33:29–35:23.

### J11 — Take the result to the right place to continue

**When** brainstorming has done its job,  
**I want to** carry the selected context into the tool or human workflow best suited to execution,  
**so I can** continue without restating the problem.

Possible handoffs are a ready-to-use prompt for the person’s AI tool, a downloadable or shareable report, a new implementation/planning task, or a consulting conversation.

Transcript: 8:31–10:32, 32:28–33:23, and 35:43–36:57.

### J12 — Set aside useful ideas without turning them into obligations

**When** I encounter an idea that is valuable but not timely,  
**I want to** store it in a recognizable place and return to it later,  
**so I can** preserve it without cluttering today’s work.

This is important to the broader organizer concept, but persistence across sessions is not required to validate the first use-case generator.

Transcript: 41:44–44:39.

## Product and business jobs

### B01 — Demonstrate value before asking for a lead

The hosted result should be useful on its own, then offer an appropriate consulting or service path. The operator wants qualified interest, not merely form completions.

Transcript: 3:23–4:03, 8:31–9:54, and 22:55–23:12.

### B02 — Keep a public personalized experience economical

The operator wants to use compact inputs, structured outputs, and appropriately small models so a free or low-friction public tool has a sensible cost per completed result.

Transcript: 3:23–4:03 and 10:44–12:20.

### B03 — Learn which use cases and audience segments have demand

Selections, zooms, handoffs, and consultation requests should reveal which roles, cells, and use cases resonate. Analytics must not require retaining the raw profile longer than necessary.

This job is implicit in the lead-generation framing and the repeated use of clicks as stronger intent signals.

Transcript: 8:31–10:32 and 36:57–39:36.

### B04 — Reuse the interaction pattern in other domains

The builder wants to learn whether structured, progressively disclosed LLM output can support other brainstorming and information-exploration products without coupling the first release to those applications.

Transcript: 40:47–50:21.

## System jobs

These are capabilities the product must perform in order to serve the user jobs.

### S01 — Extract and normalize source context

Parse a profile PDF; identify roles, employers, skills, responsibilities, achievements, industries, and chronology; and show the user what was understood.

### S02 — Separate facts, user statements, and model inferences

Keep provenance for profile facts, optional user input, external enrichment, and inferred attributes so the product does not present guesses as biography.

### S03 — Generate suggestions as structured records

Every use case needs a stable identifier, title, compact description, user problem, expected value, first step, category tags, grid placement, confidence, and provenance or rationale.

### S04 — Choose useful dimensions and classify consistently

Place suggestions on meaningful axes, prevent near-duplicates, and maintain stable category definitions within a session. Later versions may propose or swap dimensions.

### S05 — Maintain an evolving session profile

Remember uploaded context, declared intent, selections, hidden regions, zoom path, and answers so each refinement has more signal than the previous one.

### S06 — Ask only high-information follow-up questions

If more input is needed, request information that will materially change the result. Prefer one contextual choice at the point it becomes relevant over a generic questionnaire.

### S07 — Increase specificity as intent increases

Start with broad, cheap descriptions; make cell-level ideas narrower; and generate detailed artifacts only after explicit selection. This is progressive disclosure for both interface content and model cost.

### S08 — Synthesize and recommend without erasing the user’s choices

Summarize themes across selected ideas, recommend a focus area, explain why, and preserve the underlying grid and selections for inspection.

### S09 — Produce a portable handoff

Package the chosen idea, relevant personal context, constraints, and desired output into a prompt or brief that another AI tool, agent, or consultant can use immediately.

### S10 — Handle personal documents responsibly

Explain what is extracted, avoid accidental public exposure, define retention and deletion behavior, and do not scrape or republish profile information without permission.

## Adjacent jobs intentionally outside the first product

These are real jobs from the transcript, but they belong to separate experiences or later expansion:

- Improve LinkedIn/profile bullet points.
- Rewrite a profile toward a particular goal.
- Identify learning and skill-development opportunities.
- Brainstorm arbitrary topics using known input fields and adaptive questions.
- Organize personal tasks, tips, notes, and ideas into spatial “drawers.”
- Navigate an organizer from a phone in two or three taps.
- Decompose a document into progressively revealed chunks.
- Turn a transcript into findings, possible work, decisions, and next steps.
- Tag large context on two or more hierarchical dimensions and explore it like a pivot table.
- Inspect a codebase, perform a gap analysis, and spawn implementation/planning work.

See [`04-opportunity-backlog.md`](04-opportunity-backlog.md) for these opportunities in product form.

