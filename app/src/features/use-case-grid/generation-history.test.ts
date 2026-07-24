import { describe, expect, it } from "vitest";
import { exampleGrid } from "./example-data";
import {
  appendUniqueGeneration,
  collectSelectedUseCases,
  generationTitles,
} from "./generation-history";

describe("generation history", () => {
  it("keeps rounds addressable even when the model repeats ids", () => {
    const { generation, history } = appendUniqueGeneration(
      [exampleGrid],
      exampleGrid,
    );

    expect(history).toHaveLength(2);
    expect(generation.useCases[0].id).toBe("policy-answer-prep-round-2");
    expect(new Set(history.flatMap((round) => round.useCases.map((item) => item.id))).size)
      .toBe(36);
    expect(generationTitles(history)).toHaveLength(36);
  });

  it("returns selections from every generation in selection order", () => {
    const { generation, history } = appendUniqueGeneration(
      [exampleGrid],
      exampleGrid,
    );
    const selected = collectSelectedUseCases(history, [], [
      exampleGrid.useCases[0].id,
      generation.useCases[0].id,
    ]);

    expect(selected.map((item) => item.id)).toEqual([
      "policy-answer-prep",
      "policy-answer-prep-round-2",
    ]);
  });
});
