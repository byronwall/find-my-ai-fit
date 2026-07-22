# AI Use Case Grid

A personalized AI opportunity explorer built from a dictated product concept. A user can try the included HR example or upload a LinkedIn profile PDF, review extracted facts and labeled inferences, scan 18 structured use cases in a 3×3 grid, focus a promising cell, select or save ideas, and generate a portable next-step brief.

## Project map

- `app/` — SolidStart application, API routes, tests, and production build
- `ai-use-case-grid/` — product brief, complete jobs-to-be-done inventory, interaction model, backlog, example content, and mockups
- `brainstorming-tool-and-ai-use-case-generator-with-hierarchical-grid-ui.md` — original dictation transcript
- `tmp/evals/` — local browser-evaluation evidence (git-ignored)

## Run locally

Requires Node 22+ and pnpm 11.

```bash
cp app/.env.example app/.env
# Add OPENAI_API_KEY to app/.env
pnpm -C app install
pnpm -C app dev
```

The example flow works without sending a document. Personalized generation sends the selected PDF to OpenAI for the active request; the app does not persist the PDF or its extracted profile. Saved ideas are stored only in the browser on the current device.

## Verify and build

```bash
pnpm -C app verify
pnpm -C app build
```

See [the product-document index](ai-use-case-grid/README.md) and [job coverage verification](docs/jobs-to-be-done-verification.md) for the intended behavior and evidence.
