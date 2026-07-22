import { action } from "@solidjs/router";
import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import {
  briefInputSchema,
  briefSchema,
  columnLabels,
  focusInputSchema,
  focusedOutputSchema,
  generationInputSchema,
  gridOutputSchema,
  rowLabels,
  type Brief,
  type FocusedOutput,
  type GridOutput,
  type UseCase,
} from "./domain";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const modelId = () => process.env.OPENAI_MODEL ?? "gpt-5.6-terra";

const providerOptions = {
  openai: {
    reasoningEffort: "low" as const,
    textVerbosity: "low" as const,
    store: false,
    strictJsonSchema: true,
  },
};

const generationSystem = `You create practical, personalized AI use cases for working professionals.

Success means:
- extract only facts supported by the uploaded profile or explicit user input
- label cautious inferences separately
- generate concrete work tasks, not generic AI capabilities
- cover the 3 by 3 grid with two useful ideas per cell when the evidence supports it
- tie every idea to supplied context and give a small human-reviewed experiment
- flag sensitive data, legal, employment, safety, financial, or privacy concerns on the relevant idea
- never imply access to private employer systems
- never recommend automating consequential employment decisions
- return only the required structured output

The rows are:
- individual: ${rowLabels.individual}
- team: ${rowLabels.team}
- organization: ${rowLabels.organization}

The columns are:
- faster: ${columnLabels.faster}
- decisions: ${columnLabels.decisions}
- capability: ${columnLabels.capability}

Use feasibility "use-now" for a bounded prompt workflow, "configure" for approved sources or light workflow setup, and "build" for a real integration or product. Use null for sensitivityNote when no special warning is needed.`;

const normalizeIds = (useCases: UseCase[]): UseCase[] => {
  const seen = new Set<string>();
  return useCases.map((useCase, index) => {
    const base = useCase.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `use-case-${index + 1}`;
    let id = base;
    let suffix = 2;
    while (seen.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }
    seen.add(id);
    return { ...useCase, id };
  });
};

const safeError = (error: unknown) => {
  if (error instanceof Error) {
    if (error.message.includes("API key")) {
      return "The AI service is not configured yet.";
    }
    if (error.message.includes("rate") || error.message.includes("429")) {
      return "The AI service is busy. Please wait a moment and try again.";
    }
  }
  return "We could not generate this grid. Your PDF was not saved. Please try again.";
};

export async function generateGrid(rawInput: unknown): Promise<ActionResult<GridOutput>> {
    try {
      const input = generationInputSchema.parse(rawInput);
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("API key missing");
      }

      const result = await generateText({
        model: openai.responses(modelId()),
        system: generationSystem,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "file",
                data: input.base64,
                mediaType: input.mediaType,
                filename: input.filename,
              },
              {
                type: "text",
                text: `Create my AI use case grid.\n\nDeclared goal: ${input.intent.goal ?? "Explore relevant opportunities"}\nTime horizon: ${input.intent.timeHorizon ?? "Not specified"}\nAdditional direction: ${input.intent.notes ?? "None"}`,
              },
            ],
          },
        ],
        experimental_output: Output.object({ schema: gridOutputSchema }),
        providerOptions,
        maxRetries: 2,
      });

      const parsed = gridOutputSchema.parse(result.experimental_output);
      return {
        ok: true,
        data: { ...parsed, useCases: normalizeIds(parsed.useCases) },
      };
    } catch (error) {
      console.error("use-case-grid:generation-failed", {
        name: error instanceof Error ? error.name : "UnknownError",
      });
      return { ok: false, error: safeError(error) };
    }
}

export const generateGridAction = action(async (rawInput) => {
  "use server";
  return generateGrid(rawInput);
}, "generate-use-case-grid");

const focusSystem = `Refine one cell in an AI use case grid.

Success means:
- produce five to eight narrower, non-duplicative ideas inside the requested row and column
- increase specificity and actionability instead of merely rephrasing the parent ideas
- ask one short question whose answer would materially change the ranking or direction
- preserve the supplied rowId and columnId on every idea
- keep consequential decisions with qualified humans
- return only the required structured output

Use null for sensitivityNote when no special warning is needed.`;

export async function focusUseCaseCell(rawInput: unknown): Promise<ActionResult<FocusedOutput>> {
    try {
      const input = focusInputSchema.parse(rawInput);
      const result = await generateText({
        model: openai.responses(modelId()),
        system: focusSystem,
        prompt: `Profile summary: ${input.profile.summary}\nRoles: ${input.profile.roles.join(", ")}\nGoal: ${input.intent.goal ?? "Explore"}\nFocus row: ${input.rowId} (${rowLabels[input.rowId]})\nFocus column: ${input.columnId} (${columnLabels[input.columnId]})\nAlready selected: ${input.selectedTitles.join(", ") || "None"}\nUser direction: ${input.direction ?? "None"}`,
        experimental_output: Output.object({ schema: focusedOutputSchema }),
        providerOptions,
        maxRetries: 2,
      });
      const parsed = focusedOutputSchema.parse(result.experimental_output);
      return {
        ok: true,
        data: { ...parsed, useCases: normalizeIds(parsed.useCases) },
      };
    } catch (error) {
      console.error("use-case-grid:focus-failed", {
        name: error instanceof Error ? error.name : "UnknownError",
      });
      return { ok: false, error: safeError(error) };
    }
}

export const focusCellAction = action(async (rawInput) => {
  "use server";
  return focusUseCaseCell(rawInput);
}, "focus-use-case-cell");

const briefSystem = `Create a concise execution handoff from selected AI use cases.

Success means:
- synthesize the shared user intent without claiming certainty about the person
- recommend one selected idea and explain why it is the smallest sensible start
- propose a bounded, human-reviewed experiment
- produce a ready-to-copy prompt containing context, constraints, required output, and stop rules
- preserve privacy and safety caveats relevant to the selected work
- return only the required structured output.`;

export async function buildUseCaseBrief(rawInput: unknown): Promise<ActionResult<Brief>> {
    try {
      const input = briefInputSchema.parse(rawInput);
      const selectedSummary = input.selected
        .map(
          (item) =>
            `${item.id}: ${item.title} — ${item.summary}; first step: ${item.firstStep}; safety: ${item.sensitivityNote ?? "none"}`,
        )
        .join("\n");
      const result = await generateText({
        model: openai.responses(modelId()),
        system: briefSystem,
        prompt: `Profile: ${input.profile.summary}\nGoal: ${input.intent.goal ?? "Explore"}\nSelected use cases:\n${selectedSummary}`,
        experimental_output: Output.object({ schema: briefSchema }),
        providerOptions,
        maxRetries: 2,
      });
      const brief = briefSchema.parse(result.experimental_output);
      const allowedIds = new Set(input.selected.map((item) => item.id));
      return {
        ok: true,
        data: {
          ...brief,
          recommendedUseCaseId: allowedIds.has(brief.recommendedUseCaseId)
            ? brief.recommendedUseCaseId
            : input.selected[0].id,
        },
      };
    } catch (error) {
      console.error("use-case-grid:brief-failed", {
        name: error instanceof Error ? error.name : "UnknownError",
      });
      return { ok: false, error: safeError(error) };
    }
}

export const buildBriefAction = action(async (rawInput) => {
  "use server";
  return buildUseCaseBrief(rawInput);
}, "build-use-case-brief");
