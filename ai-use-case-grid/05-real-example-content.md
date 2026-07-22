# Real Example Content: HR Business Partner

This fixture is designed to drive the first live site before personalized generation is implemented. It should be stored in the same structured format that generated sessions will use.

The content is illustrative. It must not imply that the fictional person or employer has supplied private employee data, and it should not recommend putting sensitive employee information into an unapproved AI service.

## Example profile

**Role:** HR business partner  
**Environment:** Automotive manufacturer with an hourly workforce and union representation  
**Responsibilities:** Manager coaching, employee relations, policy interpretation, workforce communication, recurring issue analysis, and organizational planning  
**Declared goal:** Find practical AI use cases that could improve the current role in the next 30 days  
**Assumed constraints:** Sensitive employee information must stay inside approved systems; a human remains responsible for employment decisions and labor-relations judgment

## What the product understood

> You support managers and an hourly workforce in a regulated, unionized environment. Much of your work combines recurring communication and preparation with high-context decisions. The strongest near-term opportunities are likely to reduce preparation time and reveal patterns while keeping employee-specific judgments with qualified people.

This wording distinguishes profile facts from cautious product inference.

## Initial grid

| | Do work faster | Make better decisions | Create a new capability |
|---|---|---|---|
| **Recurring individual work** | Policy Answer Prep; Meeting Brief Builder | Case Pattern Review; Policy Ambiguity Finder | Personal HR Playbook; Sensitive-Data Prompt Guard |
| **Team and collaboration** | Manager Conversation Prep; Communication Variant Studio | Manager Issue Triage; Labor Scenario Comparison | Manager Practice Simulator; Recurring Question Router |
| **Organization and workforce** | Workforce Update Drafting; Listening-Note Synthesis | Grievance Theme Analysis; Change Impact Map | Workforce Signal Dashboard; Agreement Navigation Assistant |

## Suggestion cards

### Recurring individual work × Do work faster

#### Policy Answer Prep

**Configure** — Turn an approved policy excerpt and a manager’s question into a concise answer draft, the relevant citation, and issues that still require HR judgment.

Smallest next step: test ten common, non-sensitive questions against one approved policy and review every answer for citation accuracy.

#### Meeting Brief Builder

**Use now** — Convert non-sensitive meeting notes and a stated objective into an agenda, open questions, talking points, and follow-up checklist.

Smallest next step: use it to prepare for one recurring manager check-in and compare preparation time with the normal process.

### Recurring individual work × Make better decisions

#### Case Pattern Review

**Configure** — Group de-identified case summaries by issue, location, recurrence, and resolution to surface patterns worth investigating.

Smallest next step: manually de-identify a small historical set and ask whether the resulting themes reveal anything the existing reporting misses.

#### Policy Ambiguity Finder

**Use now** — Review a policy draft from the perspective of a manager or hourly employee and identify phrases likely to generate inconsistent interpretations.

Smallest next step: test one upcoming policy communication and have an HR colleague judge whether the flagged ambiguities are real.

### Recurring individual work × Create a new capability

#### Personal HR Playbook

**Configure** — Build a searchable, source-linked collection of approved templates, recurring questions, checklists, and lessons from completed work.

Smallest next step: collect five frequently reused, non-sensitive artifacts and define when each is appropriate.

#### Sensitive-Data Prompt Guard

**Build** — Check proposed AI inputs for employee identifiers, medical information, protected-class information, or case details before content reaches a model.

Smallest next step: define the organization’s prohibited-input categories and test detection on synthetic examples.

### Team and collaboration × Do work faster

#### Manager Conversation Prep

**Use now** — Turn a manager’s non-sensitive description of a difficult conversation into an objective, a neutral opening, questions to ask, and points to avoid prejudging.

Smallest next step: prepare for one low-risk coaching conversation and have HR review the output before use.

#### Communication Variant Studio

**Use now** — Adapt one approved message for plant leaders, frontline supervisors, and employees while preserving the same policy meaning.

Smallest next step: rewrite one routine announcement for three audiences and check that no version changes the underlying commitment.

### Team and collaboration × Make better decisions

#### Manager Issue Triage

**Configure** — Ask a manager a short sequence of questions and route the issue toward coaching, policy clarification, employee relations, safety, legal review, or urgent escalation.

Smallest next step: define routing rules for five common issue types and test them only with fictional scenarios.

#### Labor Scenario Comparison

**Use now** — Compare several proposed approaches to a labor-relations question against stated operational goals, agreement language, employee impact, and unresolved risks.

Smallest next step: use a hypothetical scenario and verify that the comparison exposes assumptions rather than recommending a decision.

### Team and collaboration × Create a new capability

#### Manager Practice Simulator

**Configure** — Let managers rehearse difficult conversations with a simulated employee response, followed by feedback tied to approved coaching principles.

Smallest next step: create one fictional scenario for a common attendance conversation and test it with two HR reviewers.

#### Recurring Question Router

**Build** — Classify incoming manager questions, answer low-risk questions from approved sources, and route sensitive or ambiguous issues to the right HR owner.

Smallest next step: categorize 50 de-identified historical questions and measure how many have a stable, source-backed answer.

### Organization and workforce × Do work faster

#### Workforce Update Drafting

**Use now** — Turn approved facts about a schedule, benefit, policy, or operational change into a plain-language workforce update and supervisor talking points.

Smallest next step: draft one routine update and compare it with the final human-written version for clarity and omissions.

#### Listening-Note Synthesis

**Configure** — Summarize de-identified notes from listening sessions into recurring themes, representative concerns, and questions requiring follow-up.

Smallest next step: test with synthetic or explicitly approved notes and require traceability back to each source passage.

### Organization and workforce × Make better decisions

#### Grievance Theme Analysis

**Configure** — Analyze de-identified grievance records to reveal recurring provisions, locations, stages, and resolution patterns without predicting individual outcomes.

Smallest next step: create a small approved dataset with consistent fields and compare AI-generated themes with the labor team’s existing view.

#### Change Impact Map

**Use now** — Map a proposed operational or policy change across affected groups, likely questions, communication needs, training gaps, and labor-relations considerations.

Smallest next step: apply the template to one low-risk upcoming change and review missing stakeholders with operations and HR.

### Organization and workforce × Create a new capability

#### Workforce Signal Dashboard

**Build** — Combine approved, aggregated indicators such as recurring questions, absence trends, survey themes, and grievance categories to highlight areas for human review.

Smallest next step: choose three already-approved aggregate measures and define what action, if any, each signal should trigger.

#### Agreement Navigation Assistant

**Build** — Retrieve relevant provisions from an approved collective bargaining agreement and related guidance, with citations and an explicit path to labor-relations review.

Smallest next step: index one agreement, create 20 benchmark questions, and reject any answer that cannot cite the controlling text.

## Focused cell example

If the user chooses **Team and collaboration × Make better decisions**, the interface should explain the focus:

> You appear most interested in helping managers handle ambiguous people issues consistently. Let’s narrow this area by the moment of support and the kind of guidance needed.

For the first live fixture, reveal a focused list rather than pretending to need another model call:

| Focused idea | Moment | Guidance |
|---|---|---|
| Manager issue intake | Before the manager acts | Routing and escalation |
| Conversation question builder | Before a conversation | Preparation |
| Live policy source finder | During review | Source retrieval |
| Scenario tradeoff comparison | Before a decision | Options and risks |
| Documentation completeness check | After a conversation | Quality check |
| Recurring manager need review | Monthly | Pattern analysis |

Suggested refinement question:

> Which would be more valuable first: helping a manager prepare, deciding where an issue belongs, or learning from recurring issues?

Only ask this question in the personalized flow if its answer changes the ranking or content.

## Selected-idea detail example

### Manager Issue Triage

**Problem**

Managers often approach HR with an incomplete narrative and may not know whether an issue is routine coaching, a policy question, or something that needs immediate specialist review.

**Why it may fit**

The profile describes frequent manager support in an environment where consistent routing and timely escalation matter. This is an inference from the role, not evidence of a current process failure.

**Expected benefit**

More complete initial information, faster routing, fewer unnecessary back-and-forth questions, and clearer escalation boundaries.

**Required inputs**

- Approved categories and escalation rules
- A list of information managers may and may not enter
- A human owner for each route
- Fictional or de-identified test scenarios

**Sensitivity note**

Do not send employee-identifiable, medical, protected, investigative, or privileged information to an unapproved service. The system must route urgent and sensitive cases; it must not decide employment outcomes.

**Smallest experiment**

Create a five-question prototype for three low-risk categories using fictional scenarios. Ask HR reviewers whether it gathers the right facts and chooses the correct route. Do not connect it to live employee channels yet.

## Final synthesis fixture

Assume the user selected **Manager Issue Triage**, **Policy Answer Prep**, **Manager Practice Simulator**, and **Grievance Theme Analysis**.

### Apparent theme

You are most interested in making HR guidance more consistent before scaling automation. Your selections cluster around giving managers better preparation and helping HR find patterns, while keeping sensitive judgments with people.

### Recommended starting point

Start with **Manager Issue Triage** because it can be tested with fictional scenarios, produces a measurable routing result, and creates useful structure for several of the other selected ideas. It is safer and smaller than beginning with live case analysis.

### Ready-to-copy prompt

```text
Help me design a small, human-reviewed prototype for manager issue triage in an HR business-partner setting.

The prototype should ask no more than five questions and route a fictional manager scenario to one of these categories: routine coaching, policy clarification, employee relations review, safety escalation, or legal/labor-relations review.

First, ask me for the approved routing rules and the information managers are prohibited from entering. Then produce:
1. the five intake questions,
2. a transparent routing table,
3. three fictional test scenarios per category,
4. failure and escalation conditions,
5. a review checklist for HR.

Do not make employment decisions, infer protected characteristics, or request real employee information. Mark any missing policy rule instead of inventing one.
```

### Optional consultation CTA

> Want help turning this into an approved pilot? Bring your routing categories and security constraints, and we’ll scope the smallest version worth testing.

The CTA follows the useful output; it does not replace or obscure it.

## Fixture acceptance checks

- Every card refers to recognizable HR work rather than generic AI capability.
- Every card has an immediate experiment appropriate to its feasibility level.
- Sensitive-data and human-decision boundaries are visible, not buried in a global disclaimer.
- The nine cells feel meaningfully different even when some suggestions could plausibly fit more than one.
- The selected path becomes narrower and more actionable.
- The final prompt can be used independently of the site.
- All fictional and inferred context is labeled as such.

