import { For, Match, Show, Switch } from "solid-js";
import { Box, Grid, HStack, Stack } from "styled-system/jsx";
import { Heading, Text } from "~/components/ui";
import type { GenerationRecord } from "~/lib/ai/generation-store";
import {
  asRecord,
  asRecords,
  asStrings,
  getInput,
  getOutput,
  readString,
} from "./presentation";

const EmptyOutput = () => (
  <Box borderWidth="1px" borderColor="brand.border" borderRadius="l2" p="6">
    <Heading as="h3" textStyle="md">No structured output</Heading>
    <Text color="brand.muted" textStyle="sm" mt="1">
      This run did not return a response that matches a known generation schema.
    </Text>
  </Box>
);

const UseCaseList = (props: { items: Record<string, unknown>[] }) => (
  <Stack gap="0" borderTopWidth="1px" borderColor="brand.border">
    <For each={props.items}>
      {(item) => (
        <Grid
          columns={{ base: 1, md: 4 }}
          gap={{ base: "2", md: "4" }}
          py="3.5"
          borderBottomWidth="1px"
          borderColor="brand.border"
          alignItems="baseline"
        >
          <Stack gap="1" gridColumn={{ md: "span 2" }}>
            <Text fontWeight="semibold">{readString(item, "title") ?? "Untitled use case"}</Text>
            <Text textStyle="sm" color="brand.muted">{readString(item, "summary")}</Text>
          </Stack>
          <Text textStyle="xs" color="brand.muted">
            {[readString(item, "rowId"), readString(item, "columnId")].filter(Boolean).join(" · ")}
          </Text>
          <HStack gap="2" justifyContent={{ md: "flex-end" }} flexWrap="wrap">
            <Show when={readString(item, "feasibility")}>
              {(value) => (
                <Box bg="brand.teal" borderRadius="l1" px="2.5" py="1" textStyle="xs">{value()}</Box>
              )}
            </Show>
            <Show when={readString(item, "specificity")}>
              {(value) => (
                <Box bg="brand.sage" borderRadius="l1" px="2.5" py="1" textStyle="xs">{value()}</Box>
              )}
            </Show>
          </HStack>
        </Grid>
      )}
    </For>
  </Stack>
);

const DirectionsOutput = (props: { output: Record<string, unknown> }) => {
  const profile = () => asRecord(props.output.profile);
  const directions = () => asRecords(props.output.directions);
  return (
    <Stack gap="5">
      <Show when={profile()}>
        {(value) => (
          <Stack gap="1.5" maxW="75ch">
            <Heading as="h3" textStyle="md">Profile interpretation</Heading>
            <Text>{readString(value(), "summary")}</Text>
          </Stack>
        )}
      </Show>
      <Grid columns={{ base: 1, md: 3 }} gap="0" borderTopWidth="1px" borderLeftWidth="1px" borderColor="brand.border">
        <For each={directions()}>
          {(direction) => (
            <Stack
              gap="2"
              p="4"
              borderRightWidth="1px"
              borderBottomWidth="1px"
              borderColor="brand.border"
              minH="36"
            >
              <Text fontWeight="bold">{readString(direction, "title") ?? "Untitled direction"}</Text>
              <Text textStyle="sm">{readString(direction, "description")}</Text>
              <Text textStyle="xs" color="brand.muted">{readString(direction, "fitReason")}</Text>
            </Stack>
          )}
        </For>
      </Grid>
    </Stack>
  );
};

const GridOutput = (props: {
  output: Record<string, unknown>;
  focused?: boolean;
}) => {
  const useCases = () => asRecords(props.output.useCases);
  const questions = () => asRecords(props.output.refinementQuestions);
  const choices = () => asStrings(props.output.choices);
  return (
    <Stack gap="5">
      <Show when={props.focused}>
        <Stack gap="4" maxW="75ch">
          <Stack gap="1.5">
            <Heading as="h3" textStyle="md">Exploration focus</Heading>
            <Text>{readString(props.output, "focusSummary") ?? "No focus summary recorded."}</Text>
          </Stack>
          <Show when={readString(props.output, "refinementQuestion")}>
            {(question) => (
              <Stack gap="2">
                <Text textStyle="xs" color="brand.muted" fontWeight="bold">
                  FOLLOW-UP QUESTION
                </Text>
                <Text fontWeight="semibold">{question()}</Text>
                <Chips items={choices()} />
              </Stack>
            )}
          </Show>
        </Stack>
      </Show>
      <HStack gap="2" flexWrap="wrap">
        <Box bg="brand.signal" borderRadius="l1" px="2.5" py="1" textStyle="xs" fontWeight="bold">
          {useCases().length} ideas
        </Box>
        <Box bg="brand.sage" borderRadius="l1" px="2.5" py="1" textStyle="xs">
          {questions().length} follow-up questions
        </Box>
      </HStack>
      <UseCaseList items={useCases()} />
      <Show when={questions().length > 0}>
        <Stack gap="3">
          <Heading as="h3" textStyle="md">Suggested next questions</Heading>
          <For each={questions()}>
            {(question) => (
              <Stack gap="1">
                <Text fontWeight="semibold">{readString(question, "question")}</Text>
                <Text textStyle="xs" color="brand.muted">
                  {Array.isArray(question.choices)
                    ? question.choices.filter((choice): choice is string => typeof choice === "string").join(" · ")
                    : ""}
                </Text>
              </Stack>
            )}
          </For>
        </Stack>
      </Show>
    </Stack>
  );
};

const Chips = (props: { items: string[] }) => (
  <HStack gap="2" flexWrap="wrap">
    <For each={props.items}>
      {(item) => (
        <Box bg="brand.sage" borderRadius="l1" px="2.5" py="1" textStyle="xs">
          {item}
        </Box>
      )}
    </For>
  </HStack>
);

const BriefOutput = (props: {
  output: Record<string, unknown>;
  generation: GenerationRecord;
}) => {
  const selected = () => asRecords(getInput(props.generation)?.selected);
  const recommendedId = () => readString(props.output, "recommendedUseCaseId");
  const recommendedTitle = () =>
    readString(selected().find((item) => readString(item, "id") === recommendedId()), "title");
  const prompts = () => {
    const current = asRecords(props.output.prompts);
    if (current.length > 0) return current;
    const legacyPrompt = readString(props.output, "prompt");
    return legacyPrompt ? [{ prompt: legacyPrompt }] : [];
  };
  return (
    <Stack gap="6">
      <Stack gap="2" maxW="75ch">
        <Heading as="h3" textStyle="md">Plan</Heading>
        <Text>{readString(props.output, "theme")}</Text>
      </Stack>
      <Box bg="brand.ink" color="brand.canvas" borderRadius="l2" p={{ base: "5", md: "6" }}>
        <Text textStyle="xs" fontWeight="bold" color="brand.signal">RECOMMENDED START</Text>
        <Heading as="h3" textStyle="lg" mt="2">{recommendedTitle() ?? recommendedId() ?? "Recommended use case"}</Heading>
        <Text mt="2" maxW="75ch">{readString(props.output, "recommendationReason")}</Text>
        <Text mt="4" fontWeight="semibold">{readString(props.output, "experiment")}</Text>
      </Box>
      <Stack gap="3">
        <Heading as="h3" textStyle="md">
          Ready-to-use {prompts().length === 1 ? "prompt" : "prompts"}
        </Heading>
        <For each={prompts()}>
          {(prompt, index) => {
            const useCaseId = () => readString(prompt, "useCaseId");
            const title = () =>
              readString(
                selected().find((item) => readString(item, "id") === useCaseId()),
                "title",
              ) ?? `Prompt ${index() + 1}`;
            return (
              <Stack gap="2" borderTopWidth="1px" borderColor="brand.border" pt="3">
                <Text fontWeight="semibold">{title()}</Text>
                <Text
                  textStyle="sm"
                  whiteSpace="pre-wrap"
                  overflowWrap="anywhere"
                  maxW="90ch"
                >
                  {readString(prompt, "prompt") ?? "Prompt text was not recorded."}
                </Text>
              </Stack>
            );
          }}
        </For>
      </Stack>
    </Stack>
  );
};

export function GenerationOutputSummary(props: { generation: GenerationRecord }) {
  const output = () => getOutput(props.generation);
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
        <Heading as="h2" textStyle="xl">Generated result</Heading>
        <Text color="brand.muted" textStyle="sm">
          Interpreted from the validated output contract.
        </Text>
      </Stack>
      <Show when={output()} fallback={<EmptyOutput />}>
        {(value) => (
          <Switch fallback={<EmptyOutput />}>
            <Match when={props.generation.kind === "profile-directions"}>
              <DirectionsOutput output={value()} />
            </Match>
            <Match when={props.generation.kind === "use-case-grid" || props.generation.kind === "focused-cell"}>
              <GridOutput
                output={value()}
                focused={props.generation.kind === "focused-cell"}
              />
            </Match>
            <Match when={props.generation.kind === "execution-brief"}>
              <BriefOutput output={value()} generation={props.generation} />
            </Match>
          </Switch>
        )}
      </Show>
    </Stack>
  );
}
