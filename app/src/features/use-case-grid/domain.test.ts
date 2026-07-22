import { describe, expect, it } from "vitest";
import {
  cellKey,
  columnIds,
  createLocalBrief,
  gridOutputSchema,
  groupUseCases,
  rowIds,
} from "./domain";
import { exampleGrid } from "./example-data";

describe("AI use case grid domain", () => {
  it("ships a complete, valid two-by-nine example grid", () => {
    const parsed = gridOutputSchema.parse(exampleGrid);
    const groups = groupUseCases(parsed.useCases);

    expect(parsed.useCases).toHaveLength(18);
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

  it("creates a portable brief from selected ideas", () => {
    const selected = exampleGrid.useCases.slice(0, 2);
    const brief = createLocalBrief(exampleGrid.profile, selected);

    expect(selected.map((item) => item.id)).toContain(brief.recommendedUseCaseId);
    expect(brief.prompt).toContain(selected[0].title);
    expect(brief.prompt).toContain("human-reviewed");
    expect(brief.experiment).toBe(selected[0].firstStep);
  });
});
