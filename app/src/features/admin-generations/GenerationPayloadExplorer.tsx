import { ChevronDown } from "lucide-solid";
import { For, Show } from "solid-js";
import { Box, Grid, HStack, Stack } from "styled-system/jsx";
import { Collapsible, Heading, Text } from "~/components/ui";
import type { GenerationRecord } from "~/lib/ai/generation-store";
import { asRecord } from "./presentation";

const humanizeKey = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());

const valueKind = (value: unknown) => {
  if (value === null || value === undefined) return "empty";
  if (Array.isArray(value)) return `${value.length} ${value.length === 1 ? "item" : "items"}`;
  if (typeof value === "object") return `${Object.keys(value).length} fields`;
  return typeof value;
};

const PrimitiveValue = (props: { value: unknown }) => {
  const display = () => {
    if (props.value === null || props.value === undefined) return "Not recorded";
    if (typeof props.value === "boolean") return props.value ? "Yes" : "No";
    if (typeof props.value === "number") return props.value.toLocaleString("en-US");
    return String(props.value);
  };
  const isLongText = () =>
    typeof props.value === "string" && (props.value.length > 160 || props.value.includes("\n"));

  return (
    <Box
      color={props.value === null || props.value === undefined ? "brand.muted" : "brand.ink"}
      fontStyle={props.value === null || props.value === undefined ? "italic" : "normal"}
      fontFamily={typeof props.value === "number" ? "mono" : "body"}
      textStyle={isLongText() ? "sm" : undefined}
      whiteSpace={isLongText() ? "pre-wrap" : "normal"}
      overflowWrap="anywhere"
      maxW={isLongText() ? "80ch" : undefined}
      bg={isLongText() ? "brand.canvas" : "transparent"}
      borderWidth={isLongText() ? "1px" : "0"}
      borderColor="brand.border"
      borderRadius={isLongText() ? "l2" : undefined}
      p={isLongText() ? "4" : "0"}
    >
      {display()}
    </Box>
  );
};

const DataNode = (props: {
  label: string;
  value: unknown;
  depth: number;
  defaultOpen?: boolean;
}) => {
  const object = () => asRecord(props.value);
  const entries = () => object() ? Object.entries(object()!) : [];
  const array = () => Array.isArray(props.value) ? props.value : undefined;
  const complex = () => object() !== undefined || array() !== undefined;

  return (
    <Show
      when={complex()}
      fallback={
        <Grid
          gridTemplateColumns={{
            base: "minmax(0, 1fr)",
            sm: "minmax(9rem, 13rem) minmax(0, 1fr)",
          }}
          gap="2"
          py="2.5"
        >
          <Text textStyle="xs" color="brand.muted" fontWeight="bold">{humanizeKey(props.label)}</Text>
          <PrimitiveValue value={props.value} />
        </Grid>
      }
    >
      <Collapsible.Root defaultOpen={props.defaultOpen ?? props.depth < 1}>
        <Collapsible.Trigger
          asChild={(triggerProps) => (
            <Box
              as="button"
              width="full"
              py="3"
              color="brand.ink"
              textAlign="left"
              borderBottomWidth="1px"
              borderColor="brand.border"
              cursor="pointer"
              _hover={{ color: "brand.green" }}
              _focusVisible={{ outline: "2px solid token(colors.brand.green)", outlineOffset: "2px" }}
              {...triggerProps()}
            >
              <HStack justifyContent="space-between" gap="3">
                <Text fontWeight="semibold">{humanizeKey(props.label)}</Text>
                <HStack gap="2" color="brand.muted">
                  <Text textStyle="xs">{valueKind(props.value)}</Text>
                  <ChevronDown size={16} aria-hidden="true" />
                </HStack>
              </HStack>
            </Box>
          )}
        />
        <Collapsible.Content>
          <Box
            pl={props.depth < 2 ? { base: "3", md: "5" } : "3"}
            borderLeftWidth="1px"
            borderColor="brand.sageStrong"
          >
            <Show when={object()}>
              <For each={entries()}>
                {([key, value]) => <DataNode label={key} value={value} depth={props.depth + 1} />}
              </For>
            </Show>
            <Show when={array()}>
              {(items) => (
                <Show
                  when={items().length > 0}
                  fallback={<Text py="3" textStyle="sm" color="brand.muted">Empty list</Text>}
                >
                  <For each={items()}>
                    {(item, index) => (
                      <DataNode
                        label={asRecord(item) ? `Item ${index() + 1}` : `${index() + 1}`}
                        value={item}
                        depth={props.depth + 1}
                      />
                    )}
                  </For>
                </Show>
              )}
            </Show>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Show>
  );
};

export function GenerationPayloadExplorer(props: { generation: GenerationRecord }) {
  const metadata = () => ({
    schemaVersion: props.generation.schemaVersion,
    id: props.generation.id,
    sessionId: props.generation.sessionId,
    roundId: props.generation.roundId,
    kind: props.generation.kind,
    status: props.generation.status,
    model: props.generation.model,
    startedAt: props.generation.startedAt,
    completedAt: props.generation.completedAt,
    durationMs: props.generation.durationMs,
  });

  return (
    <Stack
      gap="4"
      bg="brand.panel"
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="l3"
      p={{ base: "5", md: "6" }}
    >
      <Stack gap="1">
        <Heading as="h2" textStyle="xl">Complete stored record</Heading>
        <Text color="brand.muted" textStyle="sm" maxW="75ch">
          Every persisted field is available below. Open any group to inspect nested provider data,
          prompts, warnings, usage, and structured values without reading raw JSON syntax.
        </Text>
      </Stack>
      <Box borderTopWidth="1px" borderColor="brand.border">
        <DataNode label="Record metadata" value={metadata()} depth={0} defaultOpen />
        <DataNode label="Request" value={props.generation.request} depth={0} defaultOpen />
        <DataNode label="Response" value={props.generation.response} depth={0} defaultOpen />
        <DataNode
          label="Error"
          value={props.generation.error}
          depth={0}
          defaultOpen={props.generation.status === "failed"}
        />
      </Box>
    </Stack>
  );
}
