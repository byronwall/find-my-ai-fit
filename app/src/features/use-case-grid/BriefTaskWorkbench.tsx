import { ChevronRight, LockKeyhole, Trash2 } from "lucide-solid";
import { For, Show } from "solid-js";
import { Box, VStack } from "styled-system/jsx";
import { Button, Text } from "~/components/ui";
import { feasibilityLabels, type UseCase } from "./domain";
import { styles } from "./styles";

type BriefTaskWorkbenchProps = {
  items: UseCase[];
  active: UseCase;
  recommendedId?: string;
  updating: boolean;
  onSelect: (id: string) => void;
  onRemove: () => void;
};

export function BriefTaskWorkbench(props: BriefTaskWorkbenchProps) {
  return (
    <section aria-labelledby="selected-work-heading">
      <VStack alignItems="start" gap="1" mb="4">
        <Text id="selected-work-heading" fontSize="2xl" fontWeight="850" letterSpacing="tight">
          The work behind the plan
        </Text>
        <Text color="brand.muted">
          Select a task to see why it fits and the recommended way to begin.
        </Text>
      </VStack>
      <div class={styles.briefWorkbench}>
        <nav class={styles.briefPicker} aria-label="Selected tasks">
          <For each={props.items}>
            {(item, index) => (
              <button
                type="button"
                class={styles.briefPickerItem}
                classList={{ [styles.briefPickerItemActive]: props.active.id === item.id }}
                aria-current={props.active.id === item.id ? "true" : undefined}
                onClick={() => props.onSelect(item.id)}
              >
                <span class={styles.briefPickerNumber}>{index() + 1}</span>
                <span>
                  <span class={styles.briefPickerTitle}>{item.title}</span>
                  <span class={styles.briefPickerStep}>{item.firstStep}</span>
                </span>
                <ChevronRight size={17} aria-hidden="true" />
              </button>
            )}
          </For>
        </nav>

        <article class={styles.briefDetail}>
          <VStack alignItems="start" gap="2">
            <Text color="brand.green" fontWeight="semibold">
              {props.active.id === props.recommendedId
                ? "Recommended first"
                : feasibilityLabels[props.active.feasibility]}
            </Text>
            <Box as="h3" fontSize="3xl" fontWeight="850" letterSpacing="tight" lineHeight="1.1">
              {props.active.title}
            </Box>
            <Text color="brand.muted" fontSize="lg">{props.active.summary}</Text>
          </VStack>

          <div class={styles.briefDetailGrid}>
            <div>
              <Text fontWeight="800">Why it belongs in the plan</Text>
              <Text color="brand.muted" mt="1">{props.active.fitReason}</Text>
            </div>
            <div>
              <Text fontWeight="800">Expected benefit</Text>
              <Text color="brand.muted" mt="1">{props.active.expectedBenefit}</Text>
            </div>
          </div>

          <div class={styles.itemStart}>
            <Text fontWeight="850">Recommended starting point</Text>
            <Text mt="1">{props.active.firstStep}</Text>
          </div>

          <Show when={props.active.sensitivityNote}>
            {(note) => (
              <div class={styles.briefSafety} role="note">
                <LockKeyhole size={17} />
                <Text>{note()}</Text>
              </div>
            )}
          </Show>

          <Button
            variant="plain"
            disabled={props.items.length <= 1 || props.updating}
            onClick={props.onRemove}
          >
            <Trash2 size={16} />
            {props.updating
              ? "Updating plan…"
              : props.items.length <= 1
                ? "Keep at least one task"
                : "Remove from this plan"}
          </Button>
        </article>
      </div>
    </section>
  );
}
