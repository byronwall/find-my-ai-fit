import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import {
  completeGenerationRecord,
  failGenerationRecord,
  startGenerationRecord,
  type GenerationRecord,
} from "~/lib/ai/generation-store";
import {
  profileDirectionsInputSchema,
  profileDirectionsSchema,
  type ProfileDirections,
} from "./domain";

type ProfileDirectionsResult =
  | { ok: true; data: ProfileDirections; generationId: string }
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

const profileDirectionsSystem = `You find a few promising directions for a working professional to explore with AI.

Success means:
- extract only facts supported by the uploaded profile or explicit user input
- label cautious inferences separately
- propose exactly nine distinct directions grounded in recurring work from the profile
- keep every direction individual-startable: the user should be able to test or champion it without first convincing an entire organization
- describe the work area rather than prematurely prescribing a detailed solution
- use a short, glanceable title of three to six words
- keep the description to one concise sentence; put supporting evidence only in fitReason
- make each fit reason cite concrete supplied context
- never retain or repeat contact details from the profile
- return only the required structured output.`;

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

const safeError = (error: unknown) => {
  if (error instanceof Error) {
    if (error.message.includes("API key")) return "The AI service is not configured yet.";
    if (error.message.includes("rate") || error.message.includes("429")) {
      return "The AI service is busy. Please wait a moment and try again.";
    }
  }
  return "We could not read this profile. Your PDF was not saved. Please try again.";
};

export async function generateProfileDirections(
  rawInput: unknown,
  traceContext: { sessionId?: string } = {},
): Promise<ProfileDirectionsResult> {
  let generation: GenerationRecord | undefined;
  let providerResult: Awaited<ReturnType<typeof generateText>> | undefined;
  try {
    const input = profileDirectionsInputSchema.parse(rawInput);
    if (!process.env.OPENAI_API_KEY) throw new Error("API key missing");

    generation = await startGenerationRecord({
      kind: "profile-directions",
      model: modelId(),
      sessionId: traceContext.sessionId,
      request: {
        system: profileDirectionsSystem,
        input: { ...input, base64: `[redacted PDF: ${input.filename}]` },
        providerOptions,
        maxRetries: 2,
      },
    });
    const result = await generateText({
      model: openai.responses(modelId()),
      system: profileDirectionsSystem,
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
              text: `Find a few useful directions for me to explore.

Declared goal: ${input.intent.goal ?? "Explore relevant opportunities"}
Time horizon: ${input.intent.timeHorizon ?? "Not specified"}
Additional direction: ${input.intent.notes ?? "None"}`,
            },
          ],
        },
      ],
      experimental_output: Output.object({ schema: profileDirectionsSchema }),
      providerOptions,
      maxRetries: 2,
    });
    providerResult = result;
    const data = profileDirectionsSchema.parse(result.experimental_output);
    await completeGenerationRecord(generation, savedResponse(result));
    return { ok: true, data, generationId: generation.id };
  } catch (error) {
    if (generation) {
      await failGenerationRecord(
        generation,
        error,
        providerResult ? savedResponse(providerResult) : undefined,
      );
    }
    console.error("use-case-grid:profile-directions-failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return { ok: false, error: safeError(error), generationId: generation?.id };
  }
}
