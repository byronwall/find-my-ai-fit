import { z } from "zod";
import {
  briefSchema,
  directionSchema,
  gridOutputSchema,
  intentSchema,
  profileSchema,
} from "./domain";

export const sessionPendingSchema = z.enum([
  "profile",
  "grid",
  "regenerate",
  "brief",
]);

export const generationRoundSchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  generationId: z.uuid(),
  sourceRoundId: z.uuid().nullable(),
  refinementAnswers: z.record(z.string(), z.string().max(120)),
  feedback: z.string().max(1200).nullable(),
  output: gridOutputSchema,
});

export const briefSnapshotSchema = z.object({
  createdAt: z.iso.datetime(),
  generationId: z.uuid().optional(),
  selectedIds: z.array(z.string().min(1)).min(1).max(60),
  stale: z.boolean(),
  output: briefSchema,
});

export const analysisSessionSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.uuid(),
  revision: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  filename: z.string().min(1).max(180),
  source: z.literal("profile-upload"),
  intent: intentSchema,
  profile: profileSchema.nullable(),
  directions: z.array(directionSchema).max(9),
  selectedDirectionIds: z.array(z.string().min(1).max(60)).max(9),
  rounds: z.array(generationRoundSchema).max(20),
  selectedIds: z.array(z.string().min(1)).max(60),
  brief: briefSnapshotSchema.nullable(),
  pending: sessionPendingSchema.nullable(),
  pendingRoundId: z.uuid().nullable(),
  profileGenerationId: z.uuid().nullable(),
  error: z.string().max(1000).nullable(),
  notice: z.string().max(1000).nullable(),
});

export type AnalysisSession = z.infer<typeof analysisSessionSchema>;
export type GenerationRound = z.infer<typeof generationRoundSchema>;
export type SessionRouteView = "review" | "ideas" | "brief";

export const latestRound = (session: AnalysisSession) =>
  session.rounds.at(-1) ?? null;

export const sessionUseCases = (session: AnalysisSession) =>
  session.rounds.flatMap((round) => round.output.useCases);

export const selectedSessionUseCases = (session: AnalysisSession) => {
  const byId = new Map(
    sessionUseCases(session).map((useCase) => [useCase.id, useCase]),
  );
  return session.selectedIds.flatMap((id) => {
    const useCase = byId.get(id);
    return useCase ? [useCase] : [];
  });
};

export const sessionStage = (session: AnalysisSession) => {
  if (session.pending === "profile" || !session.profile) return "review" as const;
  if (session.pending === "grid" || session.rounds.length === 0) {
    return "ideas" as const;
  }
  if (session.pending === "brief" || session.brief) return "brief" as const;
  return "ideas" as const;
};
