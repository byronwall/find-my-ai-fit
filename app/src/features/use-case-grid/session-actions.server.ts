import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  profileDirectionsInputSchema,
  profileSchema,
} from "./domain";
import {
  runBriefGeneration,
  runGridGeneration,
  runProfileAnalysis,
} from "./session-generation";
import {
  selectedSessionUseCases,
  sessionUseCases,
} from "./session-domain";
import {
  createAnalysisSession,
  getAnalysisSession,
  updateAnalysisSession,
} from "./session-store";

export type SessionMutationResult =
  | { ok: true; sessionId: string; roundId?: string }
  | { ok: false; error: string };

const sessionIdSchema = z.uuid();

const setDirectionsInputSchema = z.object({
  sessionId: sessionIdSchema,
  selectedDirectionIds: z.array(z.string().min(1).max(60)).max(9),
});

const setSummaryInputSchema = z.object({
  sessionId: sessionIdSchema,
  summary: z.string().min(20).max(900),
});

const setSelectionsInputSchema = z.object({
  sessionId: sessionIdSchema,
  selectedIds: z.array(z.string().min(1)).max(60),
});

const startGridInputSchema = z.object({
  sessionId: sessionIdSchema,
  summary: z.string().min(20).max(900),
  selectedDirectionIds: z.array(z.string().min(1).max(60)).max(9),
});

const regenerateInputSchema = z.object({
  sessionId: sessionIdSchema,
  sourceRoundId: z.uuid(),
  refinementAnswers: z.record(z.string(), z.string().max(120)),
  feedback: z.string().max(1200),
});

const startBriefInputSchema = z.object({
  sessionId: sessionIdSchema,
});

const safeMutationError = (error: unknown) =>
  error instanceof Error ? error.message : "The session could not be updated.";

const unique = (values: string[]) => [...new Set(values)];

export const startProfileSession = async (
  rawInput: unknown,
): Promise<SessionMutationResult> => {
  try {
    const input = profileDirectionsInputSchema.parse(rawInput);
    const session = await createAnalysisSession({
      filename: input.filename,
      intent: input.intent,
    });
    void runProfileAnalysis(session.id, input).catch((error) => {
      console.error("use-case-session:profile-background-failed", {
        sessionId: session.id,
        name: error instanceof Error ? error.name : "UnknownError",
      });
    });
    return { ok: true, sessionId: session.id } satisfies SessionMutationResult;
  } catch (error) {
    return {
      ok: false,
      error: safeMutationError(error),
    } satisfies SessionMutationResult;
  }
};

export const setSessionDirections = async (
  rawInput: unknown,
): Promise<SessionMutationResult> => {
  try {
    const input = setDirectionsInputSchema.parse(rawInput);
    const updated = await updateAnalysisSession(input.sessionId, (session) => {
      const allowedIds = new Set(session.directions.map((direction) => direction.id));
      return {
        ...session,
        selectedDirectionIds: unique(input.selectedDirectionIds).filter((id) =>
          allowedIds.has(id),
        ),
        error: null,
      };
    });
    return updated
      ? ({ ok: true, sessionId: updated.id } satisfies SessionMutationResult)
      : ({ ok: false, error: "Session not found." } satisfies SessionMutationResult);
  } catch (error) {
    return { ok: false, error: safeMutationError(error) } satisfies SessionMutationResult;
  }
};

export const setSessionProfileSummary = async (
  rawInput: unknown,
): Promise<SessionMutationResult> => {
  try {
    const input = setSummaryInputSchema.parse(rawInput);
    const updated = await updateAnalysisSession(input.sessionId, (session) => {
      if (!session.profile) return session;
      return {
        ...session,
        profile: profileSchema.parse({ ...session.profile, summary: input.summary }),
        error: null,
      };
    });
    return updated
      ? ({ ok: true, sessionId: updated.id } satisfies SessionMutationResult)
      : ({ ok: false, error: "Session not found." } satisfies SessionMutationResult);
  } catch (error) {
    return { ok: false, error: safeMutationError(error) } satisfies SessionMutationResult;
  }
};

export const startSessionGrid = async (
  rawInput: unknown,
): Promise<SessionMutationResult> => {
  try {
    const input = startGridInputSchema.parse(rawInput);
    const roundId = randomUUID();
    const updated = await updateAnalysisSession(input.sessionId, (session) => {
      if (!session.profile) return session;
      const allowedIds = new Set(session.directions.map((direction) => direction.id));
      return {
        ...session,
        profile: profileSchema.parse({ ...session.profile, summary: input.summary }),
        selectedDirectionIds: unique(input.selectedDirectionIds).filter((id) =>
          allowedIds.has(id),
        ),
        pending: "grid",
        pendingRoundId: roundId,
        error: null,
        notice: null,
      };
    });
    if (!updated?.profile) {
      return { ok: false, error: "The analyzed profile is not ready." } satisfies SessionMutationResult;
    }
    void runGridGeneration({
      sessionId: input.sessionId,
      roundId,
      sourceRoundId: null,
      refinementAnswers: {},
      feedback: null,
    }).catch((error) => {
      console.error("use-case-session:grid-background-failed", {
        sessionId: input.sessionId,
        name: error instanceof Error ? error.name : "UnknownError",
      });
    });
    return {
      ok: true,
      sessionId: input.sessionId,
      roundId,
    } satisfies SessionMutationResult;
  } catch (error) {
    return { ok: false, error: safeMutationError(error) } satisfies SessionMutationResult;
  }
};

export const regenerateSessionGrid = async (
  rawInput: unknown,
): Promise<SessionMutationResult> => {
  try {
    const input = regenerateInputSchema.parse(rawInput);
    const session = await getAnalysisSession(input.sessionId);
    if (!session?.rounds.some((round) => round.id === input.sourceRoundId)) {
      return { ok: false, error: "The source idea set was not found." } satisfies SessionMutationResult;
    }
    if (session.pending) {
      return { ok: false, error: "Another generation is already running." } satisfies SessionMutationResult;
    }
    const roundId = randomUUID();
    await updateAnalysisSession(input.sessionId, (current) => ({
      ...current,
      pending: "regenerate",
      pendingRoundId: roundId,
      error: null,
      notice: "Generating a fresh idea set…",
    }));
    void runGridGeneration({
      sessionId: input.sessionId,
      roundId,
      sourceRoundId: input.sourceRoundId,
      refinementAnswers: input.refinementAnswers,
      feedback: input.feedback.trim() || null,
    }).catch((error) => {
      console.error("use-case-session:regenerate-background-failed", {
        sessionId: input.sessionId,
        name: error instanceof Error ? error.name : "UnknownError",
      });
    });
    return {
      ok: true,
      sessionId: input.sessionId,
      roundId,
    } satisfies SessionMutationResult;
  } catch (error) {
    return { ok: false, error: safeMutationError(error) } satisfies SessionMutationResult;
  }
};

export const setSessionSelections = async (
  rawInput: unknown,
): Promise<SessionMutationResult> => {
  try {
    const input = setSelectionsInputSchema.parse(rawInput);
    const updated = await updateAnalysisSession(input.sessionId, (session) => {
      const allowedIds = new Set(sessionUseCases(session).map((useCase) => useCase.id));
      const selectedIds = unique(input.selectedIds).filter((id) => allowedIds.has(id));
      const briefIsCurrent =
        session.brief?.selectedIds.length === selectedIds.length &&
        session.brief.selectedIds.every((id) => selectedIds.includes(id));
      return {
        ...session,
        selectedIds,
        brief: session.brief
          ? { ...session.brief, stale: !briefIsCurrent }
          : null,
        error: null,
      };
    });
    return updated
      ? ({ ok: true, sessionId: updated.id } satisfies SessionMutationResult)
      : ({ ok: false, error: "Session not found." } satisfies SessionMutationResult);
  } catch (error) {
    return { ok: false, error: safeMutationError(error) } satisfies SessionMutationResult;
  }
};

export const startSessionBrief = async (
  rawInput: unknown,
): Promise<SessionMutationResult> => {
  try {
    const input = startBriefInputSchema.parse(rawInput);
    const session = await getAnalysisSession(input.sessionId);
    if (!session || selectedSessionUseCases(session).length === 0) {
      return { ok: false, error: "Select at least one idea first." } satisfies SessionMutationResult;
    }
    if (session.pending) {
      return { ok: false, error: "Another generation is already running." } satisfies SessionMutationResult;
    }
    await updateAnalysisSession(input.sessionId, (current) => ({
      ...current,
      pending: "brief",
      error: null,
      notice: null,
    }));
    void runBriefGeneration(input.sessionId).catch((error) => {
      console.error("use-case-session:brief-background-failed", {
        sessionId: input.sessionId,
        name: error instanceof Error ? error.name : "UnknownError",
      });
    });
    return { ok: true, sessionId: input.sessionId } satisfies SessionMutationResult;
  } catch (error) {
    return { ok: false, error: safeMutationError(error) } satisfies SessionMutationResult;
  }
};
