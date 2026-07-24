import { describe, expect, it } from "vitest";
import {
  cellKey,
  columnIds,
  createLocalBrief,
  generationInputSchema,
  gridOutputSchema,
  groupUseCases,
  intentSchema,
  profileDirectionsSchema,
  rowIds,
} from "./domain";
import { exampleGrid } from "./example-data";

describe("AI use case grid domain", () => {
  it("ships a complete, valid two-by-nine example grid", () => {
    const parsed = gridOutputSchema.parse(exampleGrid);
    const groups = groupUseCases(parsed.useCases);

    expect(parsed.useCases).toHaveLength(18);
    expect(parsed.refinementQuestions.length).toBeGreaterThanOrEqual(2);
    expect(
      parsed.refinementQuestions.every((question) => question.choices.length >= 2),
    ).toBe(true);
    expect(new Set(parsed.useCases.map((item) => item.id)).size).toBe(18);
    for (const rowId of rowIds) {
      for (const columnId of columnIds) {
        expect(groups.get(cellKey(rowId, columnId))).toHaveLength(2);
      }
    }
  });

  it("keeps every suggestion actionable, grounded, and safety-aware", () => {
    for (const useCase of exampleGrid.useCases) {
      expect(useCase.firstStep.length).toBeGreaterThan(9);
      expect(useCase.provenance.length).toBeGreaterThan(0);
      expect(useCase.requiredInputs).toBeInstanceOf(Array);
    }

    expect(exampleGrid.useCases.some((item) => item.sensitivityNote)).toBe(true);
    expect(exampleGrid.profile.facts.length).toBeGreaterThan(0);
    expect(exampleGrid.profile.inferences.length).toBeGreaterThan(0);
  });

  it("validates nine glanceable directions before grid generation", () => {
    const directions = Array.from({ length: 9 }, (_, index) => ({
      id: `direction-${index + 1}`,
      title: `Direction ${index + 1}`,
      description: `Explore a concise, individual-startable work theme number ${index + 1}.`,
      fitReason: `The profile contains supporting evidence for theme number ${index + 1}.`,
    }));
    const parsed = profileDirectionsSchema.parse({
      profile: exampleGrid.profile,
      directions,
    });

    expect(parsed.directions).toHaveLength(9);
    expect(new Set(parsed.directions.map((direction) => direction.id)).size).toBe(9);
    expect(
      generationInputSchema.parse({
        profile: exampleGrid.profile,
        intent: {},
        directions: parsed.directions.slice(0, 4),
        previousTitles: ["Existing idea"],
        refinementAnswers: { ambition: "A repeatable workflow" },
        feedback: "Explore a broader set of individual-startable ideas.",
      }).directions,
    ).toHaveLength(4);
  });

  it("accepts supporting detail beyond the 100-character recommendation", () => {
    const notes = "I want ideas grounded in recurring work that I can test safely without production access. "
      + "Please favor human-reviewed experiments and explain the smallest useful first step.";

    expect(notes.length).toBeGreaterThan(100);
    expect(intentSchema.parse({ notes }).notes).toBe(notes);
  });

  it("creates a portable brief from selected ideas", () => {
    const selected = exampleGrid.useCases.slice(0, 2);
    const brief = createLocalBrief(exampleGrid.profile, selected);

    expect(selected.map((item) => item.id)).toContain(brief.recommendedUseCaseId);
    expect(brief.prompts).toHaveLength(selected.length);
    expect(brief.prompts.map((item) => item.useCaseId)).toEqual(selected.map((item) => item.id));
    expect(brief.prompts[0].prompt).toContain(selected[0].title);
    expect(brief.prompts[1].prompt).toContain(selected[1].title);
    expect(brief.prompts.every((item) => item.prompt.includes("human-reviewed"))).toBe(true);
    expect(brief.experiment).toBe(selected[0].firstStep);
    expect(brief.theme).toContain(`Start with ${selected[0].title}`);
    expect(brief.theme).toContain(selected[1].title);
  });
});
