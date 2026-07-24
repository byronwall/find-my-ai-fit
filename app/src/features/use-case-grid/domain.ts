import { z } from "zod";

export const rowIds = [
  "prepare",
  "deliver",
  "improve",
] as const;
export const columnIds = ["faster", "decisions", "capability"] as const;

export const rowLabels = {
  prepare: "Prepare and synthesize",
  deliver: "Deliver and communicate",
  improve: "Review and improve",
} as const;

export const columnLabels = {
  faster: "Do work faster",
  decisions: "Make better decisions",
  capability: "Create a new capability",
} as const;

export const feasibilityLabels = {
  "use-now": "Use now",
  configure: "Configure",
  build: "Build",
} as const;

const provenanceSchema = z.object({
  source: z.enum(["uploaded-profile", "user-input", "model-inference"]),
  detail: z.string().min(1).max(240),
});

export const useCaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(72),
  summary: z.string().min(10).max(260),
  problem: z.string().min(10).max(500),
  fitReason: z.string().min(10).max(500),
  expectedBenefit: z.string().min(10).max(400),
  requiredInputs: z.array(z.string().min(1).max(160)).max(6),
  sensitivityNote: z.string().max(500).nullable(),
  firstStep: z.string().min(10).max(500),
  feasibility: z.enum(["use-now", "configure", "build"]),
  specificity: z.enum(["broad", "focused", "actionable"]),
  rowId: z.enum(rowIds),
  columnId: z.enum(columnIds),
  provenance: z.array(provenanceSchema).min(1).max(4),
});

export const profileSchema = z.object({
  summary: z.string().min(20).max(900),
  roles: z.array(z.string().min(1).max(100)).max(8),
  industries: z.array(z.string().min(1).max(100)).max(8),
  skills: z.array(z.string().min(1).max(100)).max(12),
  organizations: z.array(z.string().min(1).max(120)).max(8),
  facts: z.array(z.string().min(1).max(240)).max(10),
  inferences: z.array(z.string().min(1).max(240)).max(8),
});

export const intentSchema = z.object({
  goal: z.string().max(120).optional(),
  timeHorizon: z.enum(["week", "quarter", "longer-term"]).optional(),
  notes: z.string().max(800).optional(),
});

export const directionSchema = z.object({
  id: z.string().min(1).max(60),
  title: z.string().min(3).max(54),
  description: z.string().min(10).max(140),
  fitReason: z.string().min(10).max(240),
});

export const profileDirectionsSchema = z.object({
  profile: profileSchema,
  directions: z.array(directionSchema).length(9),
});

export const refinementQuestionSchema = z.object({
  id: z.string().min(1).max(60),
  question: z.string().min(8).max(180),
  choices: z.array(z.string().min(2).max(90)).min(2).max(4),
});

export const gridOutputSchema = z.object({
  profile: profileSchema,
  useCases: z.array(useCaseSchema).length(18),
  refinementQuestions: z.array(refinementQuestionSchema).min(2).max(3),
});

export const focusedOutputSchema = z.object({
  focusSummary: z.string().min(10).max(400),
  refinementQuestion: z.string().min(5).max(180),
  choices: z.array(z.string().min(2).max(60)).min(2).max(4),
  useCases: z.array(useCaseSchema).min(5).max(8),
});

export const briefSchema = z.object({
  theme: z.string().min(20).max(600),
  recommendedUseCaseId: z.string().min(1),
  recommendationReason: z.string().min(20).max(600),
  experiment: z.string().min(20).max(700),
  prompts: z.array(
    z.object({
      useCaseId: z.string().min(1),
      prompt: z.string().min(80).max(4000),
    }),
  ).min(1).max(60),
});

export const profileDirectionsInputSchema = z.object({
  filename: z.string().min(1).max(180),
  mediaType: z.literal("application/pdf"),
  base64: z.string().min(100).max(14_000_000),
  intent: intentSchema,
});

export const generationInputSchema = z.object({
  profile: profileSchema,
  intent: intentSchema,
  directions: z.array(directionSchema).min(1).max(9),
  previousTitles: z.array(z.string().min(1).max(100)).max(60).optional(),
  refinementAnswers: z.record(z.string(), z.string().max(120)).optional(),
  feedback: z.string().max(1200).optional(),
});

export const focusInputSchema = z.object({
  profile: profileSchema,
  intent: intentSchema,
  rowId: z.enum(rowIds),
  columnId: z.enum(columnIds),
  selectedTitles: z.array(z.string().max(100)).max(12),
  direction: z.string().max(300).optional(),
});

export const briefInputSchema = z.object({
  profile: profileSchema,
  intent: intentSchema,
  selected: z.array(useCaseSchema).min(1).max(60),
});

export type UseCase = z.infer<typeof useCaseSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Intent = z.infer<typeof intentSchema>;
export type Direction = z.infer<typeof directionSchema>;
export type ProfileDirections = z.infer<typeof profileDirectionsSchema>;
export type GridOutput = z.infer<typeof gridOutputSchema>;
export type RefinementQuestion = z.infer<typeof refinementQuestionSchema>;
export type FocusedOutput = z.infer<typeof focusedOutputSchema>;
export type Brief = z.infer<typeof briefSchema>;
export type RowId = (typeof rowIds)[number];
export type ColumnId = (typeof columnIds)[number];

export const cellKey = (rowId: RowId, columnId: ColumnId) =>
  `${rowId}:${columnId}`;

export const groupUseCases = (useCases: UseCase[]) => {
  const groups = new Map<string, UseCase[]>();
  for (const rowId of rowIds) {
    for (const columnId of columnIds) {
      groups.set(cellKey(rowId, columnId), []);
    }
  }
  for (const useCase of useCases) {
    groups.get(cellKey(useCase.rowId, useCase.columnId))?.push(useCase);
  }
  return groups;
};

export const createUseCasePrompt = (
  profile: Profile,
  useCase: UseCase,
) =>
  `Help me design a small, human-reviewed experiment for this AI use case: ${useCase.title}.\n\nContext: ${profile.summary}\n\nThe use case: ${useCase.summary}\n\nExpected benefit: ${useCase.expectedBenefit}\n\nStart with this experiment: ${useCase.firstStep}\n\nFirst ask for any policy, privacy, data, or approval constraints that would materially change the plan. Then produce a short workflow, required inputs, success measures, failure conditions, and a review checklist. Do not invent organizational rules or request sensitive information.`;

export const createLocalBrief = (
  profile: Profile,
  selected: UseCase[],
): Brief => {
  const recommended = selected[0];
  const supportingWork = selected
    .slice(1)
    .map((item) => item.title)
    .join(", ");
  return {
    theme: `Start with ${recommended.title} as a small, human-reviewed experiment, then use what you learn to decide whether ${supportingWork ? `the supporting work—${supportingWork}—is` : "a broader version is"} worth pursuing. This creates a practical path from one visible result to a broader improvement in ${profile.roles[0] ?? "your work"} without committing to a large system build.`,
    recommendedUseCaseId: recommended.id,
    recommendationReason: `${recommended.title} is a strong starting point because its first experiment is bounded, reviewable, and produces a visible result without requiring a large system build.`,
    experiment: recommended.firstStep,
    prompts: selected.map((item) => ({
      useCaseId: item.id,
      prompt: createUseCasePrompt(profile, item),
    })),
  };
};
