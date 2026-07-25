import { buildUseCaseBrief, generateGrid } from "./actions";
import {
  createLocalBrief,
  type ProfileDirectionsInput,
} from "./domain";
import {
  appendUniqueGeneration,
  generationTitles,
} from "./generation-history";
import { generateProfileDirections } from "./profile-actions";
import { selectedSessionUseCases } from "./session-domain";
import {
  getAnalysisSession,
  updateAnalysisSession,
} from "./session-store";

export const runProfileAnalysis = async (
  sessionId: string,
  input: ProfileDirectionsInput,
) => {
  const result = await generateProfileDirections(input, { sessionId });
  await updateAnalysisSession(sessionId, (session) => {
    if (result.ok) {
      return {
        ...session,
        profile: result.data.profile,
        directions: result.data.directions,
        profileGenerationId: result.generationId,
        pending: null,
        error: null,
        notice: null,
      };
    }
    return {
      ...session,
      profileGenerationId: result.generationId ?? null,
      pending: null,
      error: result.error,
      notice: null,
    };
  });
};

export const runGridGeneration = async (input: {
  sessionId: string;
  roundId: string;
  sourceRoundId: string | null;
  refinementAnswers: Record<string, string>;
  feedback: string | null;
}) => {
  const session = await getAnalysisSession(input.sessionId);
  if (!session?.profile) return;
  const selectedDirections = session.directions.filter((direction) =>
    session.selectedDirectionIds.includes(direction.id),
  );
  const directions =
    selectedDirections.length > 0 ? selectedDirections : session.directions;
  const result = await generateGrid(
    {
      profile: session.profile,
      intent: session.intent,
      directions,
      previousTitles:
        input.sourceRoundId === null
          ? undefined
          : generationTitles(session.rounds.map((round) => round.output)),
      refinementAnswers:
        Object.keys(input.refinementAnswers).length > 0
          ? input.refinementAnswers
          : undefined,
      feedback: input.feedback ?? undefined,
    },
    { sessionId: input.sessionId, roundId: input.roundId },
  );

  await updateAnalysisSession(input.sessionId, (current) => {
    if (!result.ok) {
      return {
        ...current,
        pending: null,
        pendingRoundId: null,
        error: result.error,
        notice: null,
      };
    }
    const { generation } = appendUniqueGeneration(
      current.rounds.map((round) => round.output),
      result.data,
    );
    return {
      ...current,
      rounds: [
        ...current.rounds,
        {
          id: input.roundId,
          createdAt: new Date().toISOString(),
          generationId: result.generationId,
          sourceRoundId: input.sourceRoundId,
          refinementAnswers: input.refinementAnswers,
          feedback: input.feedback,
          output: generation,
        },
      ],
      pending: null,
      pendingRoundId: null,
      error: null,
      notice:
        input.sourceRoundId === null
          ? null
          : "A fresh set of 18 ideas is ready. Your earlier selections are still in the brief.",
    };
  });
};

export const runBriefGeneration = async (sessionId: string) => {
  const session = await getAnalysisSession(sessionId);
  if (!session?.profile) return;
  const profile = session.profile;
  const selected = selectedSessionUseCases(session);
  if (selected.length === 0) return;
  const result = await buildUseCaseBrief(
    { profile, intent: session.intent, selected },
    { sessionId },
  );
  await updateAnalysisSession(sessionId, (current) => {
    const selectedIds = selected.map((useCase) => useCase.id);
    if (result.ok) {
      return {
        ...current,
        brief: {
          createdAt: new Date().toISOString(),
          generationId: result.generationId,
          selectedIds,
          stale: false,
          output: result.data,
        },
        pending: null,
        error: null,
        notice: null,
      };
    }
    return {
      ...current,
      brief: {
        createdAt: new Date().toISOString(),
        generationId: result.generationId,
        selectedIds,
        stale: false,
        output: createLocalBrief(profile, selected),
      },
      pending: null,
      error: null,
      notice:
        "The live synthesis was unavailable, so we built a private local brief from your selections.",
    };
  });
};
