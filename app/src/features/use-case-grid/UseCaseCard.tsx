import { Bookmark, BookmarkCheck, Check, ChevronRight, EyeOff } from "lucide-solid";
import { Show, splitProps } from "solid-js";
import { cx } from "styled-system/css";
import { HStack } from "styled-system/jsx";
import { Button, IconButton } from "~/components/ui";
import { feasibilityLabels, type UseCase } from "./domain";
import { styles } from "./styles";

type UseCaseCardProps = {
  useCase: UseCase;
  selected: boolean;
  saved: boolean;
  onOpen: () => void;
  onToggleSelected: () => void;
  onToggleSaved: () => void;
  onDismiss?: () => void;
};

const feasibilityClass = {
  "use-now": styles.chipUse,
  configure: styles.chipConfigure,
  build: styles.chipBuild,
} as const;

export function UseCaseCard(props: UseCaseCardProps) {
  const [local] = splitProps(props, [
    "useCase",
    "selected",
    "saved",
    "onOpen",
    "onToggleSelected",
    "onToggleSaved",
    "onDismiss",
  ]);

  return (
    <article class={cx(styles.card, local.selected && styles.cardSelected)} data-use-case-id={local.useCase.id}>
      <button class={styles.cardTitleButton} type="button" onClick={() => local.onOpen()}>
        <HStack justifyContent="space-between" alignItems="start" gap="2">
          <span>{local.useCase.title}</span>
          <ChevronRight size={17} aria-hidden="true" />
        </HStack>
      </button>
      <p class={styles.cardSummary}>{local.useCase.summary}</p>
      <div class={styles.cardActions}>
        <span class={cx(styles.chip, feasibilityClass[local.useCase.feasibility])}>
          {feasibilityLabels[local.useCase.feasibility]}
        </span>
        <HStack gap="1">
          <IconButton
            size="xs"
            variant="plain"
            aria-label={local.saved ? `Remove ${local.useCase.title} from saved ideas` : `Save ${local.useCase.title} for later`}
            onClick={local.onToggleSaved}
          >
            <Show when={local.saved} fallback={<Bookmark size={15} />}>
              <BookmarkCheck size={15} />
            </Show>
          </IconButton>
          <Show when={local.onDismiss}>
            <IconButton size="xs" variant="plain" aria-label={`Dismiss ${local.useCase.title}`} onClick={local.onDismiss}>
              <EyeOff size={15} />
            </IconButton>
          </Show>
          <Button
            size="xs"
            variant={local.selected ? "solid" : "outline"}
            aria-pressed={local.selected}
            onClick={local.onToggleSelected}
          >
            <Check size={14} /> {local.selected ? "Selected" : "Interesting"}
          </Button>
        </HStack>
      </div>
    </article>
  );
}
