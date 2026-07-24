import { Check, Circle } from "lucide-solid";
import { splitProps } from "solid-js";
import { cx } from "styled-system/css";
import { feasibilityLabels, type UseCase } from "./domain";
import { styles } from "./styles";

type UseCaseCardProps = {
  useCase: UseCase;
  selected: boolean;
  onToggleSelected: () => void;
};

const feasibilityClass = {
  "use-now": styles.chipUse,
  configure: styles.chipConfigure,
  build: styles.chipBuild,
} as const;

export function UseCaseCard(props: UseCaseCardProps) {
  const [local] = splitProps(props, ["useCase", "selected", "onToggleSelected"]);

  return (
    <button
      class={cx(styles.card, local.selected && styles.cardSelected)}
      type="button"
      aria-pressed={local.selected}
      aria-label={`${local.selected ? "Remove" : "Mark"} ${local.useCase.title} as interesting`}
      data-use-case-id={local.useCase.id}
      onClick={() => local.onToggleSelected()}
    >
      <span class={styles.cardHeader}>
        <span class={styles.cardTitle}>{local.useCase.title}</span>
        <span class={styles.cardHeaderActions}>
          <span
            class={cx(
              styles.cardSelection,
              local.selected && styles.cardSelectionSelected,
            )}
            data-card-selection
            aria-hidden="true"
          >
            {local.selected ? <Check size={15} /> : <Circle size={15} />}
          </span>
          <span class={cx(styles.chip, feasibilityClass[local.useCase.feasibility])}>
            {feasibilityLabels[local.useCase.feasibility]}
          </span>
        </span>
      </span>
      <span class={styles.cardSummary}>{local.useCase.summary}</span>
    </button>
  );
}
