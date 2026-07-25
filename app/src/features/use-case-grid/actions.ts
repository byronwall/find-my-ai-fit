import { action } from "@solidjs/router";
import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import {
  completeGenerationRecord,
  failGenerationRecord,
  startGenerationRecord,
  type GenerationRecord,
} from "~/lib/ai/generation-store";
import {
  briefInputSchema,
  briefSchema,
  columnLabels,
  createUseCasePrompt,
  generationInputSchema,
  gridOutputSchema,
  rowLabels,
  type Brief,
  type GridOutput,
  type UseCase,
} from "./domain";

export type ActionResult<T> =
  | { ok: true; data: T; generationId: string }
  | { ok: false; error: string; generationId?: string };

const modelId = () => process.env.OPENAI_MODEL ?? "gpt-5.6-terra";

const providerOptions = {
  openai: {
    reasoningEffort: "low" as const,
    textVerbosity: "low" as const,
    store: false,
    strictJsonSchema: true,
  },
};

const savedResponse = (result: {
  experimental_output?: unknown;
  usage?: unknown;
  finishReason?: unknown;
  warnings?: unknown;
  providerMetadata?: unknown;
  response?: unknown;
}) => ({
  output: result.experimental_output,
  usage: result.usage,
  finishReason: result.finishReason,
  warnings: result.warnings,
  providerMetadata: result.providerMetadata,
  providerResponse: result.response,
});

const generationSystem = `You create practical, personalized AI use cases for working professionals.

Success means:
- preserve the supplied profile object exactly in the response
- generate concrete work tasks, not generic AI capabilities
- cover the 3 by 3 grid with two useful ideas per cell when the evidence supports it
- prioritize the user's selected directions while preserving enough breadth to reveal adjacent opportunities
- include two or three short multiple-choice questions that would help a later generation explore broader or meaningfully different territory
- when prior ideas, answers, or feedback are supplied, generate a genuinely fresh replacement set rather than paraphrasing the earlier ideas
- tie every idea to supplied context and give a small human-reviewed experiment
- make every idea individual-startable even when it could later help a team or organization
- avoid duplicate ideas that merely rename the same workflow
- flag sensitive data, legal, employment, safety, financial, or privacy concerns on the relevant idea
- never imply access to private employer systems
- never recommend automating consequential employment decisions
- return only the required structured output

The rows are:
- prepare: ${rowLabels.prepare} — gather context, synthesize inputs, or get ready for work
- deliver: ${rowLabels.deliver} — create, communicate, facilitate, or complete the work
- improve: ${rowLabels.improve} — review outcomes, find patterns, and strengthen the next cycle

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

export async function generateGrid(
  rawInput: unknown,
  traceContext: { sessionId?: string; roundId?: string } = {},
): Promise<ActionResult<GridOutput>> {
    let generation: GenerationRecord | undefined;
    let providerResult: Awaited<ReturnType<typeof generateText>> | undefined;
    try {
      const input = generationInputSchema.parse(rawInput);
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("API key missing");
      }

      generation = await startGenerationRecord({
        kind: "use-case-grid",
        model: modelId(),
        sessionId: traceContext.sessionId,
        roundId: traceContext.roundId,
        request: {
          system: generationSystem,
          input,
          providerOptions,
          maxRetries: 2,
        },
      });
      const result = await generateText({
        model: openai.responses(modelId()),
        system: generationSystem,
        prompt: `Create an AI use case grid.

Profile summary: ${input.profile.summary}
Roles: ${input.profile.roles.join(", ") || "Not specified"}
Industries: ${input.profile.industries.join(", ") || "Not specified"}
Skills: ${input.profile.skills.join(", ") || "Not specified"}
Selected directions:
${input.directions
  .map(
    (direction) =>
      `- ${direction.title}: ${direction.description} Evidence: ${direction.fitReason}`,
  )
  .join("\n")}
Declared goal: ${input.intent.goal ?? "Explore relevant opportunities"}
Time horizon: ${input.intent.timeHorizon ?? "Not specified"}
Additional direction: ${input.intent.notes ?? "None"}
Previous idea titles to avoid: ${input.previousTitles?.join(", ") || "None"}
Answers about the next direction:
${Object.entries(input.refinementAnswers ?? {})
  .map(([questionId, answer]) => `- ${questionId}: ${answer}`)
  .join("\n") || "None"}
Open feedback from the user: ${input.feedback ?? "None"}`,
        experimental_output: Output.object({ schema: gridOutputSchema }),
        providerOptions,
        maxRetries: 2,
      });
      providerResult = result;

      const parsed = gridOutputSchema.parse(result.experimental_output);
      const data = {
        profile: input.profile,
        useCases: normalizeIds(parsed.useCases),
        refinementQuestions: parsed.refinementQuestions,
      };
      await completeGenerationRecord(generation, {
        ...savedResponse(result),
        normalizedOutput: data,
      });
      return {
        ok: true,
        data,
        generationId: generation.id,
      };
    } catch (error) {
      if (generation) {
        await failGenerationRecord(
          generation,
          error,
          providerResult ? savedResponse(providerResult) : undefined,
        );
      }
      console.error("use-case-grid:generation-failed", {
        name: error instanceof Error ? error.name : "UnknownError",
      });
      return { ok: false, error: safeError(error), generationId: generation?.id };
    }
}

export const generateGridAction = action(async (rawInput) => {
  "use server";
  return generateGrid(rawInput);
}, "generate-use-case-grid");

const briefSystem = `Create a concise execution handoff from selected AI use cases.

Success means:
- synthesize the selections into one simple, coherent plan without claiming certainty about the person
- write the theme as a useful plan of action, not a category label, personality reading, or restatement of the selected titles
- explain how the selected tasks work together, what outcome they build toward, and the sensible sequence in two to four plain-language sentences
- recommend one selected idea and explain why it is the smallest sensible start
- propose a bounded, human-reviewed experiment
- produce one distinct ready-to-copy prompt for every selected use case
- pair every prompt with the exact selected use case id and include context, constraints, required output, and stop rules
- preserve privacy and safety caveats relevant to the selected work
- return only the required structured output.`;

export async function buildUseCaseBrief(
  rawInput: unknown,
  traceContext: { sessionId?: string } = {},
): Promise<ActionResult<Brief>> {
    let generation: GenerationRecord | undefined;
    let providerResult: Awaited<ReturnType<typeof generateText>> | undefined;
    try {
      const input = briefInputSchema.parse(rawInput);
      const selectedSummary = input.selected
        .map(
          (item) =>
            `${item.id}: ${item.title} — ${item.summary}; first step: ${item.firstStep}; safety: ${item.sensitivityNote ?? "none"}`,
        )
        .join("\n");
      const prompt = `Profile: ${input.profile.summary}\nGoal: ${input.intent.goal ?? "Explore"}\nSelected use cases:\n${selectedSummary}`;
      generation = await startGenerationRecord({
        kind: "execution-brief",
        model: modelId(),
        sessionId: traceContext.sessionId,
        request: { system: briefSystem, prompt, input, providerOptions, maxRetries: 2 },
      });
      const result = await generateText({
        model: openai.responses(modelId()),
        system: briefSystem,
        prompt,
        experimental_output: Output.object({ schema: briefSchema }),
        providerOptions,
        maxRetries: 2,
      });
      providerResult = result;
      const brief = briefSchema.parse(result.experimental_output);
      const allowedIds = new Set(input.selected.map((item) => item.id));
      const generatedPrompts = new Map(
        brief.prompts
          .filter((item) => allowedIds.has(item.useCaseId))
          .map((item) => [item.useCaseId, item.prompt]),
      );
      const data = {
        ...brief,
        recommendedUseCaseId: allowedIds.has(brief.recommendedUseCaseId)
          ? brief.recommendedUseCaseId
          : input.selected[0].id,
        prompts: input.selected.map((item) => ({
          useCaseId: item.id,
          prompt: generatedPrompts.get(item.id) ?? createUseCasePrompt(input.profile, item),
        })),
      };
      await completeGenerationRecord(generation, {
        ...savedResponse(result),
        normalizedOutput: data,
      });
      return {
        ok: true,
        data,
        generationId: generation.id,
      };
    } catch (error) {
      if (generation) {
        await failGenerationRecord(
          generation,
          error,
          providerResult ? savedResponse(providerResult) : undefined,
        );
      }
      console.error("use-case-grid:brief-failed", {
        name: error instanceof Error ? error.name : "UnknownError",
      });
      return { ok: false, error: safeError(error), generationId: generation?.id };
    }
}

export const buildBriefAction = action(async (rawInput) => {
  "use server";
  return buildUseCaseBrief(rawInput);
}, "build-use-case-brief");
