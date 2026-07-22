import { Bookmark, BookmarkCheck, Check, EyeOff, LockKeyhole, X } from "lucide-solid";
import { For, Show } from "solid-js";
import { Box, HStack, VStack } from "styled-system/jsx";
import { Button, IconButton, Text } from "~/components/ui";
import { feasibilityLabels, type UseCase } from "./domain";
import { styles } from "./styles";

type UseCaseDetailProps = {
  useCase: UseCase;
  selected: boolean;
  saved: boolean;
  onClose: () => void;
  onToggleSelected: () => void;
  onToggleSaved: () => void;
  onDismiss: () => void;
};

export function UseCaseDetail(props: UseCaseDetailProps) {
  return (
    <aside class={styles.inspector} aria-label={`${props.useCase.title} details`}>
      <div class={styles.inspectorHeader}>
        <VStack alignItems="start" gap="2">
          <Text color="brand.green" textStyle="sm" fontWeight="semibold">
            {feasibilityLabels[props.useCase.feasibility]}
          </Text>
          <Box as="h2" fontFamily="Georgia, serif" fontSize="2xl" fontWeight="bold">
            {props.useCase.title}
          </Box>
        </VStack>
        <IconButton aria-label="Close details" variant="plain" onClick={props.onClose}>
          <X size={18} />
        </IconButton>
      </div>

      <div class={styles.inspectorBody}>
        <section class={styles.detailSection}>
          <Text fontFamily="Georgia, serif" fontSize="lg" fontWeight="bold">The work problem</Text>
          <Text color="brand.muted">{props.useCase.problem}</Text>
        </section>
        <section class={styles.detailSection}>
          <Text fontFamily="Georgia, serif" fontSize="lg" fontWeight="bold">Why it may fit</Text>
          <Text color="brand.muted">{props.useCase.fitReason}</Text>
          <VStack alignItems="stretch" gap="1" mt="2">
            <For each={props.useCase.provenance}>
              {(item) => <Text textStyle="xs" color="brand.muted">{item.source.replaceAll("-", " ")}: {item.detail}</Text>}
            </For>
          </VStack>
        </section>
        <section class={styles.detailSection}>
          <Text fontFamily="Georgia, serif" fontSize="lg" fontWeight="bold">Expected benefit</Text>
          <Text color="brand.muted">{props.useCase.expectedBenefit}</Text>
        </section>
        <section class={styles.detailSection}>
          <Text fontFamily="Georgia, serif" fontSize="lg" fontWeight="bold">Smallest experiment</Text>
          <Text color="brand.muted">{props.useCase.firstStep}</Text>
        </section>

        <Show when={props.useCase.sensitivityNote}>
          {(note) => (
            <div class={styles.warning} role="note">
              <LockKeyhole size={18} />
              <VStack alignItems="start" gap="1">
                <Text fontWeight="semibold">Sensitive data</Text>
                <Text textStyle="sm">{note()}</Text>
              </VStack>
            </div>
          )}
        </Show>

        <VStack alignItems="stretch" gap="2">
          <Button variant={props.selected ? "outline" : "solid"} onClick={props.onToggleSelected}>
            <Check size={16} /> {props.selected ? "Remove from brief" : "Add to my brief"}
          </Button>
          <HStack gap="2">
            <Button flex="1" variant="outline" onClick={props.onToggleSaved}>
              <Show when={props.saved} fallback={<Bookmark size={16} />}><BookmarkCheck size={16} /></Show>
              {props.saved ? "Saved" : "Save for later"}
            </Button>
            <Button flex="1" variant="plain" onClick={props.onDismiss}>
              <EyeOff size={16} /> Dismiss
            </Button>
          </HStack>
        </VStack>
      </div>
    </aside>
  );
}
