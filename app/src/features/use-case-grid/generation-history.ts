import type { GridOutput, UseCase } from "./domain";

export const generationTitles = (history: GridOutput[]) =>
  history.flatMap((generation) => generation.useCases.map((item) => item.title));

export const appendUniqueGeneration = (
  history: GridOutput[],
  output: GridOutput,
): { generation: GridOutput; history: GridOutput[] } => {
  const knownIds = new Set(
    history.flatMap((generation) => generation.useCases.map((item) => item.id)),
  );
  const round = history.length + 1;
  const useCases = output.useCases.map((item, index) => {
    if (!knownIds.has(item.id)) {
      knownIds.add(item.id);
      return item;
    }
    let id = `${item.id}-round-${round}`;
    let suffix = index + 2;
    while (knownIds.has(id)) {
      id = `${item.id}-round-${round}-${suffix}`;
      suffix += 1;
    }
    knownIds.add(id);
    return { ...item, id };
  });
  const generation = { ...output, useCases };
  return { generation, history: [...history, generation] };
};

export const collectSelectedUseCases = (
  history: GridOutput[],
  focused: UseCase[],
  selectedIds: string[],
) => {
  const byId = new Map(
    [...history.flatMap((generation) => generation.useCases), ...focused].map(
      (item) => [item.id, item],
    ),
  );
  return selectedIds.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
};
