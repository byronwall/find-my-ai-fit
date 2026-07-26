import { For, Show } from "solid-js";
import { Box, Grid, HStack, Stack } from "styled-system/jsx";
import { Heading, Text } from "~/components/ui";
import type { GenerationRecord } from "~/lib/ai/generation-store";
import {
  asRecord,
  asRecords,
  asStrings,
  getInput,
  readString,
} from "./presentation";

const Label = (props: { children: string }) => (
  <Text textStyle="xs" color="brand.muted" fontWeight="bold">
    {props.children}
  </Text>
);

const Chips = (props: { items: string[]; empty?: string }) => (
  <Show
    when={props.items.length > 0}
    fallback={<Text textStyle="sm" color="brand.muted">{props.empty ?? "Not provided"}</Text>}
  >
    <HStack gap="2" flexWrap="wrap">
      <For each={props.items}>
        {(item) => (
          <Box bg="brand.sage" borderRadius="l1" px="2.5" py="1" textStyle="xs">
            {item}
          </Box>
        )}
      </For>
    </HStack>
  </Show>
);

const IntentSummary = (props: { intent?: Record<string, unknown> }) => (
  <Stack gap="3">
    <Heading as="h3" textStyle="md">Declared intent</Heading>
    <Grid columns={{ base: 1, sm: 2 }} gap="4">
      <Stack gap="1">
        <Label>Goal</Label>
        <Text textStyle="sm">{readString(props.intent, "goal") ?? "Open exploration"}</Text>
      </Stack>
      <Stack gap="1">
        <Label>Time horizon</Label>
        <Text textStyle="sm">{readString(props.intent, "timeHorizon") ?? "Not specified"}</Text>
      </Stack>
    </Grid>
    <Show when={readString(props.intent, "notes")}>
      {(notes) => (
        <Stack gap="1">
          <Label>Additional direction</Label>
          <Text textStyle="sm" maxW="75ch">{notes()}</Text>
        </Stack>
      )}
    </Show>
  </Stack>
);

export function GenerationRequestSummary(props: { generation: GenerationRecord }) {
  const input = () => getInput(props.generation);
  const profile = () => asRecord(input()?.profile);
  const intent = () => asRecord(input()?.intent);
  const directions = () => asRecords(input()?.directions);
  const selected = () => asRecords(input()?.selected);
  const previousTitles = () =>
    asStrings(input()?.previousTitles).length
      ? asStrings(input()?.previousTitles)
      : asStrings(input()?.selectedTitles);

  return (
    <Stack
      gap="6"
      bg="brand.panel"
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="l3"
      p={{ base: "5", md: "6" }}
    >
      <Stack gap="1">
        <Heading as="h2" textStyle="xl">Request context</Heading>
        <Text color="brand.muted" textStyle="sm">
          The person, intent, and choices that shaped this run.
        </Text>
      </Stack>

      <Show when={profile()}>
        {(value) => (
          <Stack gap="4">
            <Stack gap="1.5">
              <Label>Profile summary</Label>
              <Text maxW="75ch">{readString(value(), "summary") ?? "No summary recorded."}</Text>
            </Stack>
            <Grid columns={{ base: 1, md: 3 }} gap="4">
              <Stack gap="2">
                <Label>Roles</Label>
                <Chips items={asStrings(value().roles)} />
              </Stack>
              <Stack gap="2">
                <Label>Industries</Label>
                <Chips items={asStrings(value().industries)} />
              </Stack>
              <Stack gap="2">
                <Label>Skills</Label>
                <Chips items={asStrings(value().skills)} />
              </Stack>
            </Grid>
          </Stack>
        )}
      </Show>

      <IntentSummary intent={intent()} />

      <Show when={readString(input(), "filename")}>
        {(filename) => (
          <Stack gap="2">
            <Heading as="h3" textStyle="md">Source document</Heading>
            <HStack gap="2" flexWrap="wrap">
              <Text fontWeight="semibold">{filename()}</Text>
              <Box bg="brand.teal" borderRadius="l1" px="2.5" py="1" textStyle="xs">
                PDF body redacted
              </Box>
            </HStack>
          </Stack>
        )}
      </Show>

      <Show when={directions().length > 0}>
        <Stack gap="3">
          <Heading as="h3" textStyle="md">Selected directions</Heading>
          <Grid columns={{ base: 1, md: 2 }} gap="3">
            <For each={directions()}>
              {(direction) => (
                <Stack gap="1" borderTopWidth="1px" borderColor="brand.border" pt="3">
                  <Text fontWeight="semibold">{readString(direction, "title") ?? "Untitled direction"}</Text>
                  <Text textStyle="sm" color="brand.muted">
                    {readString(direction, "description") ?? readString(direction, "fitReason")}
                  </Text>
                </Stack>
              )}
            </For>
          </Grid>
        </Stack>
      </Show>

      <Show when={selected().length > 0}>
        <Stack gap="3">
          <Heading as="h3" textStyle="md">Selected use cases ({selected().length})</Heading>
          <Chips items={selected().map((item) => readString(item, "title") ?? "Untitled use case")} />
        </Stack>
      </Show>

      <Show when={previousTitles().length > 0}>
        <Stack gap="2">
          <Label>Previous ideas excluded</Label>
          <Chips items={previousTitles()} />
        </Stack>
      </Show>

      <Show when={readString(input(), "feedback")}>
        {(feedback) => (
          <Stack gap="1">
            <Label>Open feedback</Label>
            <Text textStyle="sm">{feedback()}</Text>
          </Stack>
        )}
      </Show>
    </Stack>
  );
}
