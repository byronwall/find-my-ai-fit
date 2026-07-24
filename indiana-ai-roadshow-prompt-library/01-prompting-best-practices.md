# 01 — Prompting best practices

For each technique, run the plain prompt first, then the upgraded one. Notice the difference in the output — that gap is the whole point.

## 1. Ask it to "Show Its Work" (chain of thought)

Reduce errors and "hallucinations" by making the AI explain its reasoning step-by-step before giving a final answer.

### Plain prompt

```text
We budgeted $120,000 for materials this year. Five months in, we've spent $61,000. Are we on track, and how much can we spend each remaining month?
```

### With the best practice

```text
We budgeted $120,000 for materials this year. Five months in, we've spent $61,000. Work through this step by step: first the spending pace we should be at by now, then where we actually are, then the monthly amount available across the remaining months. Show each calculation before you give your final answer on whether we're on track.
```

## 2. Provide "Golden Examples" (few-shot)

Guide the AI on the tone and structure you want by giving it an existing, non-sensitive document to model.

### Plain prompt

```text
Write a short, friendly email inviting our customers to our fall open house.
```

### With the best practice

```text
Below is an example of the tone and structure we like for our customer emails. Using it as a model, write a NEW email inviting customers to our fall open house.
EXAMPLE:
Subject: A quick heads-up on our new hours
Hi everyone — starting next month we're opening an hour earlier on weekdays to make mornings easier for you. Nothing you need to do today; just wanted you to hear it from us first. Thanks for being the best part of this business. — The [Business Name] Team
```

## 3. Flip the Script: ask for questions

Before a major task, have the AI pose the questions that would improve the deliverable — surfacing the context gaps you didn't think to mention.

### Plain prompt

```text
Help me write a proposal for a large commercial contract we're bidding on.
```

### With the best practice

```text
I need to write a proposal for a large commercial contract we're bidding on. Before you write anything, ask me the 5 most important questions you'd need answered to make this proposal excellent and complete. Wait for my answers before drafting.
```

## 4. The "Second Draft" Rule

The first answer is a starting point, not the finish line. Run the first prompt, then run each refinement one at a time in the same chat.

### Plain prompt (stop at the first answer)

```text
Write a 3-paragraph announcement for our customers about our new online ordering system.
```

### With the best practice (run these next, one at a time)

```text
Review your work and make sure it is the best you can possibly do.
---
Make this 20% shorter without losing the key points.
---
Make the tone warmer and less formal.
---
What's the weakest part of this draft? Fix it.
---
Give me three alternative versions of the opening line.
```

## 5. One Job Per Prompt (task chaining)

Big tasks fail as one giant prompt. Break them into steps and review at each stage — errors get caught early instead of propagating.

### Plain prompt

```text
Create a complete employee handbook for my 12-person business.
```

### With the best practice

```text
We're going to build an employee handbook in steps, and I'll review each one before we continue. Step 1: propose a table of contents for a 12-person [type of business]. Stop and show me. Once I approve it, we'll draft one section at a time, and I'll give you feedback as we go.
```

